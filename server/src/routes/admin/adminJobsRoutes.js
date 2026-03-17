const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
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
router.get("/:id", getAdminJobById);
router.post("/", createAdminJob);
router.put("/:id", updateAdminJob);
router.post("/:id/repost", repostAdminJob);
router.delete("/:id", deleteAdminJob);

module.exports = router;