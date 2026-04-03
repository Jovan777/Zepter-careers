import { adminHttp } from "./adminHttp";
import type { AdminCandidate, AdminCandidateDetailsResponse } from "../types/admin";

const buildQuery = (params: Record<string, string>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value);
  });
  const q = query.toString();
  return q ? `?${q}` : "";
};

export const getAdminCandidates = async (
  token: string,
  params: { email?: string; search?: string } = {}
) =>
  adminHttp.get<{ candidates: AdminCandidate[] }>(
    `/admin/candidates${buildQuery({
      email: params.email || "",
      search: params.search || "",
    })}`,
    token
  );

export const getAdminCandidateById = async (token: string, publicId: string) =>
  adminHttp.get<AdminCandidateDetailsResponse>(`/admin/candidates/${publicId}`, token);