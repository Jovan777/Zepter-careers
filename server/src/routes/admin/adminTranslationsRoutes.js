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
router.get("/jobs/:publicId", getJobTranslationsOverview);
router.get("/jobs/:publicId/:locale", getJobTranslationByLocale);
router.post("/jobs/:publicId", saveJobTranslation);
router.put("/jobs/:publicId/:locale", updateJobTranslationByLocale);
router.delete("/jobs/:publicId/:locale", deleteJobTranslationByLocale);
router.post("/jobs/:publicId/copy", copyJobTranslation);

module.exports = router;