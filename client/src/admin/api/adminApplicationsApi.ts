import { adminHttp } from "./adminHttp";
import type { AdminApplicationDetailsResponse, AdminApplicationListItem } from "../types/admin";

const buildQuery = (params: Record<string, string>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value);
  });
  const q = query.toString();
  return q ? `?${q}` : "";
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