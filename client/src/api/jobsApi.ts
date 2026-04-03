import { http } from "./http";
import type {
  JobDetailsResponse,
  JobFiltersResponse,
  JobsListResponse,
} from "../types/jobs";

export type GetJobsParams = {
  locale?: string;
  search?: string;
  company?: string;
  region?: string;
  workArea?: string;
  locationType?: string;
  employmentType?: string;
  page?: number;
  limit?: number;
};

const buildQueryString = (params: GetJobsParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getPublishedJobs = async (
  params: GetJobsParams = {}
): Promise<JobsListResponse> => {
  return http.get<JobsListResponse>(`/jobs${buildQueryString(params)}`);
};

export const getJobById = async (
  publicId: string,
  locale = "sr"
): Promise<JobDetailsResponse> => {
  const query = new URLSearchParams({ locale }).toString();
  return http.get<JobDetailsResponse>(`/jobs/${publicId}?${query}`);
};

export const getJobFilters = async (): Promise<JobFiltersResponse> => {
  return http.get<JobFiltersResponse>("/jobs/filters");
};