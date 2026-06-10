import { http } from "./http";

export type SubmitTalentPoolPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  areaOfInterest: string;
  message?: string;
  acceptedTerms: boolean;
  marketingConsent?: boolean;
  locale?: string;
  captchaId: string;
  captchaAnswer: string;
  companyWebsite?: string;
  cv: File;
};

export type SubmitTalentPoolResponse = {
  message: string;
  application: {
    publicId: string;
    status: string;
  };
};

export const submitTalentPoolApplication = async (
  payload: SubmitTalentPoolPayload
) => {
  const formData = new FormData();

  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone || "");
  formData.append("areaOfInterest", payload.areaOfInterest);
  formData.append("message", payload.message || "");
  formData.append("acceptedTerms", String(payload.acceptedTerms));
  formData.append("marketingConsent", String(Boolean(payload.marketingConsent)));
  formData.append("locale", payload.locale || "sr");
  formData.append("captchaId", payload.captchaId);
  formData.append("captchaAnswer", payload.captchaAnswer);
  formData.append("companyWebsite", payload.companyWebsite || "");
  formData.append("cv", payload.cv);

  return http.post<SubmitTalentPoolResponse>("/talent-pool", formData);
};
