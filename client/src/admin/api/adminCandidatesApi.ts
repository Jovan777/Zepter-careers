import { adminHttp, ADMIN_API_BASE_URL } from "./adminHttp";
import type {
  AdminCandidate,
  AdminCandidateDetailsResponse,
} from "../types/admin";

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
      // ignore
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

export const getAdminCandidates = async (
  token: string,
  params: { email?: string; search?: string } = {},
) =>
  adminHttp.get<{ candidates: AdminCandidate[] }>(
    `/admin/candidates${buildQuery({
      email: params.email || "",
      search: params.search || "",
    })}`,
    token,
  );

export const getAdminArchivedCandidates = async (
  token: string,
  params: { email?: string; search?: string } = {},
) =>
  adminHttp.get<{ candidates: AdminCandidate[] }>(
    `/admin/candidates/archived${buildQuery({
      email: params.email || "",
      search: params.search || "",
    })}`,
    token,
  );

export const getAdminCandidateById = async (token: string, publicId: string) =>
  adminHttp.get<AdminCandidateDetailsResponse>(
    `/admin/candidates/${publicId}`,
    token,
  );

export const archiveAdminCandidate = async (
  token: string,
  publicId: string,
  body: { reason?: string } = {},
) => adminHttp.put(`/admin/candidates/${publicId}/archive`, body, token);

export const restoreAdminCandidate = async (token: string, publicId: string) =>
  adminHttp.put(`/admin/candidates/${publicId}/restore`, {}, token);

export const exportAdminCandidates = async (
  token: string,
  params: { email?: string; search?: string } = {},
) => {
  const query = buildQuery({
    email: params.email || "",
    search: params.search || "",
  });

  return downloadFile(
    `${ADMIN_API_BASE_URL}/admin/candidates/export${query}`,
    token,
    "zepter-active-candidates.xlsx",
  );
};

export const exportAdminArchivedCandidates = async (
  token: string,
  params: { email?: string; search?: string } = {},
) => {
  const query = buildQuery({
    email: params.email || "",
    search: params.search || "",
  });

  return downloadFile(
    `${ADMIN_API_BASE_URL}/admin/candidates/archived/export${query}`,
    token,
    "zepter-archived-candidates.xlsx",
  );
};
