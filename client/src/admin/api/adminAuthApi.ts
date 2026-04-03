import { adminHttp } from "./adminHttp";
import type { AdminLoginResponse, AdminUser } from "../types/admin";

export const loginAdmin = async (payload: { email: string; password: string }) =>
  adminHttp.post<AdminLoginResponse>("/admin/auth/login", payload);

export const getCurrentAdmin = async (token: string) =>
  adminHttp.get<{ admin: AdminUser }>("/admin/auth/me", token);

export const logoutAdmin = async (token: string) =>
  adminHttp.post<{ message: string }>("/admin/auth/logout", {}, token);