import { useCallback, useEffect, useState } from "react";
import { getCaptcha } from "../api/captchaApi";

const EMPTY_CAPTCHA_MESSAGE = "Unesite rezultat bezbednosne provere.";
const CAPTCHA_LOAD_ERROR =
  "Bezbednosna provera trenutno nije dostupna. Osvežite pitanje i pokušajte ponovo.";

type RefreshOptions = {
  preserveError?: boolean;
};

type UseHumanVerificationOptions = {
  isActive?: boolean;
};

export const useHumanVerification = ({
  isActive = true,
}: UseHumanVerificationOptions = {}) => {
  const [captchaId, setCaptchaId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState("");

  const reset = useCallback(() => {
    setCaptchaId("");
    setQuestion("");
    setAnswer("");
    setError("");
    setIsLoading(false);
    setCompanyWebsite("");
  }, []);

  const refresh = useCallback(async (options: RefreshOptions = {}) => {
    const { preserveError = false } = options;

    try {
      setIsLoading(true);
      if (!preserveError) {
        setError("");
      }

      const captcha = await getCaptcha();
      setCaptchaId(captcha.captchaId);
      setQuestion(captcha.question);
      setAnswer("");
    } catch (captchaError) {
      console.error(captchaError);
      setCaptchaId("");
      setQuestion("");
      setAnswer("");
      if (!preserveError) {
        setError(CAPTCHA_LOAD_ERROR);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      reset();
      return;
    }

    let isMounted = true;

    const loadCaptcha = async () => {
      try {
        setIsLoading(true);
        setError("");
        const captcha = await getCaptcha();

        if (!isMounted) return;

        setCaptchaId(captcha.captchaId);
        setQuestion(captcha.question);
        setAnswer("");
      } catch (captchaError) {
        console.error(captchaError);

        if (!isMounted) return;

        setCaptchaId("");
        setQuestion("");
        setAnswer("");
        setError(CAPTCHA_LOAD_ERROR);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCaptcha();

    return () => {
      isMounted = false;
    };
  }, [isActive, reset]);

  const validate = useCallback(() => {
    if (!answer.trim()) {
      setError(EMPTY_CAPTCHA_MESSAGE);
      return false;
    }

    if (!captchaId) {
      setError(CAPTCHA_LOAD_ERROR);
      return false;
    }

    setError("");
    return true;
  }, [answer, captchaId]);

  const updateAnswer = useCallback(
    (value: string) => {
      setAnswer(value);
      if (error) {
        setError("");
      }
    },
    [error]
  );

  const getPayload = useCallback(
    () => ({
      captchaId,
      captchaAnswer: answer.trim(),
      companyWebsite,
    }),
    [answer, captchaId, companyWebsite]
  );

  const handleBackendError = useCallback(
    async (message: string) => {
      setError(message);
      await refresh({ preserveError: true });
    },
    [refresh]
  );

  return {
    captchaId,
    question,
    answer,
    error,
    isLoading,
    companyWebsite,
    setAnswer: updateAnswer,
    setCompanyWebsite,
    refresh,
    reset,
    validate,
    getPayload,
    handleBackendError,
  };
};
