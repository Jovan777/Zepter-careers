const express = require("express");
const { createCaptcha } = require("../services/captchaService");
const { captchaRateLimit } = require("../middlewares/publicRateLimitMiddleware");

const router = express.Router();

router.get("/", captchaRateLimit, (_req, res) => {
  res.json(createCaptcha());
});

module.exports = router;
