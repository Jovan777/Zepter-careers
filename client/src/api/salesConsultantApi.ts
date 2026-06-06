import { http } from "./http";

export type SubmitSalesConsultantPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  message?: string;
  acceptedTerms: boolean;
  marketingConsent?: boolean;
  captchaId: string;
  captchaAnswer: string;
  companyWebsite?: string;
  cv?: File | null;
};

export type SubmitSalesConsultantResponse = {
  message: string;
  application: {
    publicId: string;
    status: string;
  };
};

export const submitSalesConsultantApplication = async (
  payload: SubmitSalesConsultantPayload
) => {
  const formData = new FormData();

  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("country", payload.country);
  formData.append("city", payload.city || "");
  formData.append("message", payload.message || "");
  formData.append("acceptedTerms", String(payload.acceptedTerms));
  formData.append("marketingConsent", String(Boolean(payload.marketingConsent)));
  formData.append("captchaId", payload.captchaId);
  formData.append("captchaAnswer", payload.captchaAnswer);
  formData.append("companyWebsite", payload.companyWebsite || "");

  if (payload.cv) {
    formData.append("cv", payload.cv);
  }

  return http.post<SubmitSalesConsultantResponse>(
    "/sales-consultant-applications",
    formData
  );
};
