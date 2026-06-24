const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getAdminContactMessages,
  getAdminContactMessagesUnreadCount,
  getAdminContactMessageById,
  updateAdminContactMessageStatus,
  updateAdminContactMessageNote,
} = require("../../controllers/admin/adminContactMessagesController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getAdminContactMessages);
router.get("/unread-count", getAdminContactMessagesUnreadCount);
router.get("/:id", getAdminContactMessageById);
router.patch("/:id/status", updateAdminContactMessageStatus);
router.patch("/:id/note", updateAdminContactMessageNote);

module.exports = router;
