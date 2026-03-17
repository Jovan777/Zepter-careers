const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getAdminCandidates,
  getAdminCandidateById,
} = require("../../controllers/admin/adminCandidatesController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminCandidates);
router.get("/:publicId", getAdminCandidateById);

module.exports = router;