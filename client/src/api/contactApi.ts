import { http } from "./http";

export type SubmitContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  contactReason: string;
  message: string;
  locale?: string;
  captchaId: string;
  captchaAnswer: string;
  companyWebsite?: string;
};

export type SubmitContactResponse = {
  message: string;
};

export const submitContactMessage = async (payload: SubmitContactPayload) =>
  http.post<SubmitContactResponse>("/contact", payload);
