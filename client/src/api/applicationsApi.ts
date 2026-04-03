import { http } from "./http";

export type SubmitApplicationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  jobPublicId: string;
  coverLetter: string;
  acceptedTerms: boolean;
  marketingConsent: boolean;
  locale?: string;
  cv: File;
  extraFiles?: File[];
};

export const submitApplication = async (
  payload: SubmitApplicationPayload
) => {
  const formData = new FormData();

  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("phone", payload.phone);
  formData.append("country", payload.country || "");
  formData.append("city", payload.city || "");
  formData.append("jobPublicId", payload.jobPublicId);
  formData.append("coverLetter", payload.coverLetter);
  formData.append("acceptedTerms", String(payload.acceptedTerms));
  formData.append("marketingConsent", String(payload.marketingConsent));
  formData.append("locale", payload.locale || "sr");
  formData.append("cv", payload.cv);

  (payload.extraFiles || []).forEach((file) => {
    formData.append("extraFiles", file);
  });

  return http.post("/applications", formData);
};