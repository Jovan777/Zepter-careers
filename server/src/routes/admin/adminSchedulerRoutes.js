const express = require("express");
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");
const {
  getSchedulerEvents,
  getSchedulerEventById,
  createSchedulerEvent,
  updateSchedulerEvent,
  deleteSchedulerEvent,
} = require("../../controllers/admin/adminSchedulerController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/", getSchedulerEvents);
router.get("/:id", getSchedulerEventById);
router.post("/", createSchedulerEvent);
router.put("/:id", updateSchedulerEvent);
router.delete("/:id", deleteSchedulerEvent);

module.exports = router;