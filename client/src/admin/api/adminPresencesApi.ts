import { adminHttp } from "./adminHttp";
import type { Presence } from "../types/admin";

export const getPresences = async (token: string) =>
  adminHttp.get<Presence[]>("/admin/presences", token);

export const getPresenceById = async (token: string, id: string) =>
  adminHttp.get<Presence>(`/admin/presences/${id}`, token);

export const createPresence = async (
  token: string,
  body: {
    company: string;
    region: string;
    isActive?: boolean;
  }
) => adminHttp.post("/admin/presences", body, token);

export const updatePresence = async (
  token: string,
  id: string,
  body: {
    company?: string;
    region?: string;
    isActive?: boolean;
  }
) => adminHttp.put(`/admin/presences/${id}`, body, token);

export const deletePresence = async (token: string, id: string) =>
  adminHttp.delete(`/admin/presences/${id}`, token);