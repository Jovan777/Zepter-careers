const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getAdminApplications,
  getAdminApplicationById,
  updateAdminApplicationStatus,
} = require("../../controllers/admin/adminApplicationsController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminApplications);
router.get("/:publicId", getAdminApplicationById);
router.put("/:publicId/status", updateAdminApplicationStatus);

module.exports = router;