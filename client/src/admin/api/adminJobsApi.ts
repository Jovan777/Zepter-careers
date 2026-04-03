import { adminHttp } from "./adminHttp";
import type { AdminJobDetailsResponse, AdminJobListItem } from "../types/admin";

export const getAdminJobs = async (token: string, locale = "sr") =>
  adminHttp.get<{ supportedLocales: string[]; jobs: AdminJobListItem[] }>(
    `/admin/jobs?locale=${locale}`,
    token
  );

export const getAdminJobById = async (token: string, publicId: string, locale = "sr") =>
  adminHttp.get<AdminJobDetailsResponse>(`/admin/jobs/${publicId}?locale=${locale}`, token);

export const createAdminJob = async (token: string, body: Record<string, unknown>) =>
  adminHttp.post(`/admin/jobs`, body, token);

export const updateAdminJob = async (
  token: string,
  publicId: string,
  body: Record<string, unknown>
) => adminHttp.put(`/admin/jobs/${publicId}`, body, token);

export const repostAdminJob = async (
  token: string,
  publicId: string,
  body: { publishStartAt?: string; publishEndAt?: string | null }
) => adminHttp.post(`/admin/jobs/${publicId}/repost`, body, token);

export const deleteAdminJob = async (token: string, publicId: string) =>
  adminHttp.delete(`/admin/jobs/${publicId}`, token);