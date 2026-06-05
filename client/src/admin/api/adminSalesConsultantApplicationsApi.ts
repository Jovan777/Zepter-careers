import { adminHttp } from "./adminHttp";
import type {
  AdminSalesConsultantDetailsResponse,
  AdminSalesConsultantListResponse,
} from "../types/admin";

const buildQuery = (params: Record<string, string>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value);
  });

  const q = query.toString();
  return q ? `?${q}` : "";
};

export const getAdminSalesConsultantApplications = async (
  token: string,
  params: { search?: string; status?: string } = {}
) =>
  adminHttp.get<AdminSalesConsultantListResponse>(
    `/admin/sales-consultant-applications${buildQuery({
      search: params.search || "",
      status: params.status || "",
    })}`,
    token
  );

export const getAdminSalesConsultantApplicationById = async (
  token: string,
  publicId: string
) =>
  adminHttp.get<AdminSalesConsultantDetailsResponse>(
    `/admin/sales-consultant-applications/${publicId}`,
    token
  );

export const updateAdminSalesConsultantApplicationStatus = async (
  token: string,
  publicId: string,
  body: { status: string; reason?: string }
) =>
  adminHttp.put(
    `/admin/sales-consultant-applications/${publicId}/status`,
    body,
    token
  );
