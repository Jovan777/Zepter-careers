const express = require("express");
const { submitApplication } = require("../controllers/applicationController");
const uploadApplicationFiles = require("../middlewares/applicationUploadMiddleware");
const { publicSubmissionRateLimit } = require("../middlewares/publicRateLimitMiddleware");
const {
  createHumanVerificationMiddleware,
} = require("../middlewares/verifyCaptchaMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Applications ruta radi. Za slanje prijave koristi POST /api/applications",
  });
});

router.post(
  "/",
  publicSubmissionRateLimit,
  uploadApplicationFiles.fields([
    { name: "cv", maxCount: 1 },
    { name: "extraFiles", maxCount: 10 },
  ]),
  createHumanVerificationMiddleware(),
  submitApplication
);

module.exports = router;
