import { adminHttp } from "./adminHttp";
import type { Region } from "../types/admin";

export const getRegions = async (token: string) =>
  adminHttp.get<Region[]>("/admin/regions", token);

export const getRegionById = async (token: string, id: string) =>
  adminHttp.get<Region>(`/admin/regions/${id}`, token);

export const createRegion = async (
  token: string,
  body: {
    type?: string;
    name: string;
    isoCode?: string;
    parentRegion?: string | null;
    isActive?: boolean;
  }
) => adminHttp.post("/admin/regions", body, token);

export const updateRegion = async (
  token: string,
  id: string,
  body: {
    type?: string;
    name?: string;
    isoCode?: string;
    parentRegion?: string | null;
    isActive?: boolean;
  }
) => adminHttp.put(`/admin/regions/${id}`, body, token);

export const deleteRegion = async (token: string, id: string) =>
  adminHttp.delete(`/admin/regions/${id}`, token);