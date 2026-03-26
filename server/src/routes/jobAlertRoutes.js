const express = require("express");
const {
  subscribeToJobAlerts,
  unsubscribeFromJobAlerts,
} = require("../controllers/jobAlertController");

const router = express.Router();

router.post("/", subscribeToJobAlerts);
router.post("/unsubscribe", unsubscribeFromJobAlerts);

module.exports = router;