const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getAdminSalesConsultantApplications,
  getAdminSalesConsultantApplicationById,
  updateAdminSalesConsultantApplicationStatus,
} = require("../../controllers/admin/adminSalesConsultantApplicationsController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminSalesConsultantApplications);
router.get("/:publicId", getAdminSalesConsultantApplicationById);
router.put("/:publicId/status", updateAdminSalesConsultantApplicationStatus);

module.exports = router;
