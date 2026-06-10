const express = require("express");
const { submitContactMessage } = require("../controllers/contactController");
const { contactRateLimit } = require("../middlewares/publicRateLimitMiddleware");
const {
  createHumanVerificationMiddleware,
} = require("../middlewares/verifyCaptchaMiddleware");

const router = express.Router();

router.post(
  "/",
  contactRateLimit,
  createHumanVerificationMiddleware({
    honeypotSuccessMessage: "Vaša poruka je uspešno poslata.",
  }),
  submitContactMessage
);

module.exports = router;
