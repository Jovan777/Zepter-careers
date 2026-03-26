const express = require("express");
const {
  startPhoneVerification,
  confirmPhoneVerification,
  resendPhoneVerification,
} = require("../controllers/phoneVerificationController");

const router = express.Router();

router.post("/start", startPhoneVerification);
router.post("/confirm", confirmPhoneVerification);
router.post("/resend", resendPhoneVerification);

module.exports = router;