import { adminHttp } from "./adminHttp";
import type {
  AdminTranslation,
  JobTranslationsOverviewResponse,
  TranslationJobListItem,
} from "../types/admin";

export const getTranslationJobs = async (token: string, locale = "sr") =>
  adminHttp.get<{ jobs: TranslationJobListItem[] }>(
    `/admin/translations/jobs?locale=${locale}`,
    token
  );

export const getJobTranslationsOverview = async (token: string, publicId: string) =>
  adminHttp.get<JobTranslationsOverviewResponse>(
    `/admin/translations/jobs/${publicId}`,
    token
  );

export const getJobTranslationByLocale = async (
  token: string,
  publicId: string,
  locale: string
) =>
  adminHttp.get<{ translation: AdminTranslation | null }>(
    `/admin/translations/jobs/${publicId}/${locale}`,
    token
  );

export const saveJobTranslation = async (
  token: string,
  publicId: string,
  body: Record<string, unknown>
) => adminHttp.post(`/admin/translations/jobs/${publicId}`, body, token);

export const updateJobTranslation = async (
  token: string,
  publicId: string,
  locale: string,
  body: Record<string, unknown>
) => adminHttp.put(`/admin/translations/jobs/${publicId}/${locale}`, body, token);

export const deleteJobTranslation = async (token: string, publicId: string, locale: string) =>
  adminHttp.delete(`/admin/translations/jobs/${publicId}/${locale}`, token);

export const copyJobTranslation = async (
  token: string,
  publicId: string,
  body: { fromLocale: string; toLocale: string }
) => adminHttp.post(`/admin/translations/jobs/${publicId}/copy`, body, token);