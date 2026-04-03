import { adminHttp } from "./adminHttp";
import type { SchedulerEvent } from "../types/admin";

export const getSchedulerEvents = async (token: string) =>
  adminHttp.get<{ events: SchedulerEvent[] }>("/admin/scheduler", token);

export const getSchedulerEventById = async (token: string, id: string) =>
  adminHttp.get<{ event: SchedulerEvent }>(`/admin/scheduler/${id}`, token);

export const createSchedulerEvent = async (
  token: string,
  body: {
    application: string;
    type?: string;
    startAt: string;
    endAt: string;
    timezone?: string;
    locationOrLink?: string;
    notes?: string;
  }
) => adminHttp.post("/admin/scheduler", body, token);

export const updateSchedulerEvent = async (
  token: string,
  id: string,
  body: {
    type?: string;
    startAt?: string;
    endAt?: string;
    timezone?: string;
    locationOrLink?: string;
    notes?: string;
  }
) => adminHttp.put(`/admin/scheduler/${id}`, body, token);

export const deleteSchedulerEvent = async (token: string, id: string) =>
  adminHttp.delete(`/admin/scheduler/${id}`, token);