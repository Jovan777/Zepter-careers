import { adminHttp } from "./adminHttp";
import type { Company } from "../types/admin";

export const getCompanies = async (token: string) =>
  adminHttp.get<Company[]>("/admin/companies", token);

export const getCompanyById = async (token: string, id: string) =>
  adminHttp.get<Company>(`/admin/companies/${id}`, token);

export const createCompany = async (
  token: string,
  body: {
    name: string;
    legalEntity?: string;
    isActive?: boolean;
  }
) => adminHttp.post("/admin/companies", body, token);

export const updateCompany = async (
  token: string,
  id: string,
  body: {
    name?: string;
    legalEntity?: string;
    isActive?: boolean;
  }
) => adminHttp.put(`/admin/companies/${id}`, body, token);

export const deleteCompany = async (token: string, id: string) =>
  adminHttp.delete(`/admin/companies/${id}`, token);