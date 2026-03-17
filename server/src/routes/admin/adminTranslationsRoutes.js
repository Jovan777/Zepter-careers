const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getTranslationJobs,
  getJobTranslationsOverview,
  getJobTranslationByLocale,
  saveJobTranslation,
  updateJobTranslationByLocale,
  deleteJobTranslationByLocale,
  copyJobTranslation,
} = require("../../controllers/admin/adminTranslationsController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/jobs", getTranslationJobs);
router.get("/jobs/:jobId", getJobTranslationsOverview);
router.get("/jobs/:jobId/:locale", getJobTranslationByLocale);
router.post("/jobs/:jobId", saveJobTranslation);
router.put("/jobs/:jobId/:locale", updateJobTranslationByLocale);
router.delete("/jobs/:jobId/:locale", deleteJobTranslationByLocale);
router.post("/jobs/:jobId/copy", copyJobTranslation);

module.exports = router;