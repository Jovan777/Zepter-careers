import { http } from "./http";

export type SubscribeToJobAlertsPayload = {
  email: string;
  keyword?: string;
  locale?: string;
  workArea?: string;
  locationType?: string;
  city?: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
};

export const subscribeToJobAlerts = async (
  payload: SubscribeToJobAlertsPayload
) => {
  return http.post("/job-alerts", payload);
};