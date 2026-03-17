const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getPresences,
  getPresenceById,
  createPresence,
  updatePresence,
  deletePresence,
} = require("../../controllers/admin/adminPresencesController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getPresences);
router.get("/:id", getPresenceById);
router.post("/", createPresence);
router.put("/:id", updatePresence);
router.delete("/:id", deletePresence);

module.exports = router;