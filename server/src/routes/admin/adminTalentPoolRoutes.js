const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getAdminTalentPoolApplications,
  getAdminTalentPoolApplicationById,
  updateAdminTalentPoolApplicationStatus,
} = require("../../controllers/admin/adminTalentPoolController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminTalentPoolApplications);
router.get("/:publicId", getAdminTalentPoolApplicationById);
router.put("/:publicId/status", updateAdminTalentPoolApplicationStatus);

module.exports = router;
