import { adminHttp, ADMIN_API_BASE_URL } from "./adminHttp";
import type { AdminApplicationDetailsResponse, AdminApplicationListItem } from "../types/admin";

const buildQuery = (params: Record<string, string>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value);
  });
  const q = query.toString();
  return q ? `?${q}` : "";
};

const downloadFile = async (url: string, token: string, fileName: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Greška pri preuzimanju fajla.";

    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch {
      // server možda nije vratio JSON
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

export const getAdminApplications = async (
  token: string,
  params: { status?: string; email?: string; search?: string } = {}
) =>
  adminHttp.get<{ statuses: string[]; applications: AdminApplicationListItem[] }>(
    `/admin/applications${buildQuery({
      status: params.status || "",
      email: params.email || "",
      search: params.search || "",
    })}`,
    token
  );

export const getAdminApplicationById = async (token: string, publicId: string) =>
  adminHttp.get<AdminApplicationDetailsResponse>(`/admin/applications/${publicId}`, token);

export const updateAdminApplicationStatus = async (
  token: string,
  publicId: string,
  body: { status: string; reason?: string }
) => adminHttp.put(`/admin/applications/${publicId}/status`, body, token);

export const exportAdminApplications = async (
  token: string,
  params: { status?: string; email?: string; search?: string } = {}
) => {
  const query = buildQuery({
    status: params.status || "",
    email: params.email || "",
    search: params.search || "",
  });

  return downloadFile(
    `${ADMIN_API_BASE_URL}/admin/applications/export${query}`,
    token,
    "zepter-applications.xlsx"
  );
};