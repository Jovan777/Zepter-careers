const express = require("express");
const {
  startEmailVerification,
  confirmEmailVerification,
  resendEmailVerification,
} = require("../controllers/emailVerificationController");

const router = express.Router();

router.post("/start", startEmailVerification);
router.get("/confirm", confirmEmailVerification);
router.post("/resend", resendEmailVerification);

module.exports = router;