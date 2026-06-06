const fs = require("fs");
const { verifyCaptcha } = require("../services/captchaService");

const CAPTCHA_INVALID_MESSAGE =
  "Bezbednosna provera nije ispravna. Pokušajte ponovo.";
const CAPTCHA_EXPIRED_MESSAGE =
  "Bezbednosna provera je istekla. Osvežite pitanje i pokušajte ponovo.";

const getUploadedFiles = (req) => {
  if (req.file) return [req.file];

  if (!req.files) return [];

  if (Array.isArray(req.files)) return req.files;

  return Object.values(req.files).flat();
};

const cleanupUploadedFiles = (req) => {
  getUploadedFiles(req).forEach((file) => {
    if (!file?.path) return;

    fs.unlink(file.path, (error) => {
      if (error && error.code !== "ENOENT") {
        console.error("Greška pri brisanju odbačenog upload fajla:", error.message);
      }
    });
  });
};

const getCaptchaErrorMessage = (reason) =>
  reason === "expired" ? CAPTCHA_EXPIRED_MESSAGE : CAPTCHA_INVALID_MESSAGE;

const createHumanVerificationMiddleware = ({
  honeypotSuccessMessage = "Vaša prijava je uspešno poslata.",
} = {}) => {
  return (req, res, next) => {
    if (String(req.body?.companyWebsite || "").trim()) {
      cleanupUploadedFiles(req);
      return res.json({
        message: honeypotSuccessMessage,
      });
    }

    const result = verifyCaptcha(req.body?.captchaId, req.body?.captchaAnswer);

    if (!result.ok) {
      cleanupUploadedFiles(req);
      return res.status(400).json({
        message: getCaptchaErrorMessage(result.reason),
      });
    }

    return next();
  };
};

module.exports = {
  createHumanVerificationMiddleware,
  cleanupUploadedFiles,
};
