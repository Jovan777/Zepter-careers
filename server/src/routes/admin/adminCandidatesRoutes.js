const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getAdminCandidates,
  getAdminArchivedCandidates,
  getAdminCandidateById,
  archiveAdminCandidate,
  restoreAdminCandidate,
  exportAdminCandidates,
  exportAdminArchivedCandidates,
} = require("../../controllers/admin/adminCandidatesController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminCandidates);
router.get("/export", exportAdminCandidates);
router.get("/archived", getAdminArchivedCandidates);
router.get("/archived/export", exportAdminArchivedCandidates);

router.get("/:publicId", getAdminCandidateById);
router.put("/:publicId/archive", archiveAdminCandidate);
router.put("/:publicId/restore", restoreAdminCandidate);

module.exports = router;