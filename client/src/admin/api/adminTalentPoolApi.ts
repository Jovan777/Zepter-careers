import { adminHttp } from "./adminHttp";
import type {
  AdminTalentPoolDetailsResponse,
  AdminTalentPoolListResponse,
} from "../types/admin";

const buildQuery = (params: Record<string, string>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value);
  });

  const q = query.toString();
  return q ? `?${q}` : "";
};

export const getAdminTalentPoolApplications = async (
  token: string,
  params: { search?: string; status?: string; areaOfInterest?: string } = {}
) =>
  adminHttp.get<AdminTalentPoolListResponse>(
    `/admin/talent-pool${buildQuery({
      search: params.search || "",
      status: params.status || "",
      areaOfInterest: params.areaOfInterest || "",
    })}`,
    token
  );

export const getAdminTalentPoolApplicationById = async (
  token: string,
  publicId: string
) =>
  adminHttp.get<AdminTalentPoolDetailsResponse>(
    `/admin/talent-pool/${publicId}`,
    token
  );

export const updateAdminTalentPoolApplicationStatus = async (
  token: string,
  publicId: string,
  body: { status: string; reason?: string }
) => adminHttp.put(`/admin/talent-pool/${publicId}/status`, body, token);
