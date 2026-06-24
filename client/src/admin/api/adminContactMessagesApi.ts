import { adminHttp } from "./adminHttp";
import type {
  AdminContactMessageDetailsResponse,
  AdminContactMessageMutationResponse,
  AdminContactMessagesListResponse,
  AdminContactMessagesUnreadCountResponse,
} from "../types/admin";

const buildQuery = (params: Record<string, string>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) query.set(key, value);
  });

  const q = query.toString();
  return q ? `?${q}` : "";
};

export const getAdminContactMessages = async (
  token: string,
  params: { search?: string; status?: string } = {}
) =>
  adminHttp.get<AdminContactMessagesListResponse>(
    `/admin/contact-messages${buildQuery({
      search: params.search || "",
      status: params.status || "",
    })}`,
    token
  );

export const getAdminContactMessagesUnreadCount = async (token: string) =>
  adminHttp.get<AdminContactMessagesUnreadCountResponse>(
    "/admin/contact-messages/unread-count",
    token
  );

export const getAdminContactMessageById = async (token: string, id: string) =>
  adminHttp.get<AdminContactMessageDetailsResponse>(
    `/admin/contact-messages/${id}`,
    token
  );

export const updateAdminContactMessageStatus = async (
  token: string,
  id: string,
  status: string
) =>
  adminHttp.patch<AdminContactMessageMutationResponse>(
    `/admin/contact-messages/${id}/status`,
    { status },
    token
  );

export const updateAdminContactMessageNote = async (
  token: string,
  id: string,
  adminNote: string
) =>
  adminHttp.patch<AdminContactMessageMutationResponse>(
    `/admin/contact-messages/${id}/note`,
    { adminNote },
    token
  );
