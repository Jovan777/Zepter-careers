import { http } from "./http";

export type CaptchaChallenge = {
  captchaId: string;
  question: string;
};

export const getCaptcha = () => http.get<CaptchaChallenge>("/captcha");
