const express = require("express");
const multer = require("multer");
const {
  submitSalesConsultantApplication,
} = require("../controllers/salesConsultantApplicationController");
const uploadApplicationFiles = require("../middlewares/applicationUploadMiddleware");
const { publicSubmissionRateLimit } = require("../middlewares/publicRateLimitMiddleware");
const {
  createHumanVerificationMiddleware,
} = require("../middlewares/verifyCaptchaMiddleware");

const router = express.Router();

const uploadOptionalCv = (req, res, next) => {
  uploadApplicationFiles.single("cv")(req, res, (error) => {
    if (!error) return next();

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "CV fajl može biti najviše 10 MB.",
      });
    }

    return res.status(400).json({
      message: error.message || "Greška pri otpremanju CV fajla.",
    });
  });
};

router.post(
  "/",
  publicSubmissionRateLimit,
  uploadOptionalCv,
  createHumanVerificationMiddleware(),
  submitSalesConsultantApplication
);

module.exports = router;
