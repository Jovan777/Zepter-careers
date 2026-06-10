const crypto = require("crypto");

const CAPTCHA_TTL_MS = 10 * 60 * 1000;
const EXPIRED_CAPTCHA_RETENTION_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const challenges = new Map();

const cleanupExpiredCaptchas = () => {
  const now = Date.now();

  for (const [captchaId, challenge] of challenges.entries()) {
    if (challenge.expiresAt + EXPIRED_CAPTCHA_RETENTION_MS <= now) {
      challenges.delete(captchaId);
    }
  }
};

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createCaptcha = () => {
  cleanupExpiredCaptchas();

  const isAddition = Math.random() >= 0.5;
  let firstNumber;
  let secondNumber;
  let operator;
  let answer;

  if (isAddition) {
    firstNumber = getRandomInt(2, 12);
    secondNumber = getRandomInt(2, 12);
    operator = "+";
    answer = firstNumber + secondNumber;
  } else {
    firstNumber = getRandomInt(6, 18);
    secondNumber = getRandomInt(1, firstNumber - 1);
    operator = "-";
    answer = firstNumber - secondNumber;
  }

  const captchaId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString("hex");

  challenges.set(captchaId, {
    answer,
    expiresAt: Date.now() + CAPTCHA_TTL_MS,
    attempts: 0,
  });

  return {
    captchaId,
    question: `Koliko je ${firstNumber} ${operator} ${secondNumber}?`,
  };
};

const verifyCaptcha = (captchaId, answer) => {
  if (!captchaId || answer === undefined || answer === null || String(answer).trim() === "") {
    return { ok: false, reason: "missing" };
  }

  const challenge = challenges.get(String(captchaId));

  if (!challenge) {
    cleanupExpiredCaptchas();
    return { ok: false, reason: "missing" };
  }

  if (challenge.expiresAt <= Date.now()) {
    challenges.delete(String(captchaId));
    return { ok: false, reason: "expired" };
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    challenges.delete(String(captchaId));
    return { ok: false, reason: "too_many_attempts" };
  }

  const normalizedAnswer = Number.parseInt(String(answer).trim(), 10);

  if (Number.isNaN(normalizedAnswer) || normalizedAnswer !== challenge.answer) {
    challenge.attempts += 1;

    if (challenge.attempts >= MAX_ATTEMPTS) {
      challenges.delete(String(captchaId));
      return { ok: false, reason: "too_many_attempts" };
    }

    return { ok: false, reason: "invalid" };
  }

  challenges.delete(String(captchaId));
  return { ok: true };
};

setInterval(cleanupExpiredCaptchas, CAPTCHA_TTL_MS).unref();

module.exports = {
  createCaptcha,
  verifyCaptcha,
};
