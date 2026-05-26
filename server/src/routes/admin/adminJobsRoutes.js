const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const uploadPdf = require("../../middlewares/pdfUploadMiddleware");
const {
  importJobPdf,
  getAdminJobs,
  getAdminJobById,
  createAdminJob,
  updateAdminJob,
  repostAdminJob,
  deleteAdminJob,
} = require("../../controllers/admin/adminJobsController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminJobs);
router.post("/import-pdf", uploadPdf, importJobPdf);
router.get("/:publicId", getAdminJobById);
router.post("/", createAdminJob);
router.put("/:publicId", updateAdminJob);
router.post("/:publicId/repost", repostAdminJob);
router.delete("/:publicId", deleteAdminJob);

module.exports = router;
