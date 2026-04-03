import { adminHttp } from "./adminHttp";
import type { DashboardStats } from "../types/admin";

export const getDashboardStats = async (token: string) =>
  adminHttp.get<DashboardStats>("/admin/dashboard", token);