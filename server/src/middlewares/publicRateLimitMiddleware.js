const RATE_LIMIT_MESSAGE = "Previše pokušaja. Pokušajte ponovo kasnije.";

const getForwardedIp = (value) => {
  if (Array.isArray(value)) {
    return value[0]?.split(",")[0]?.trim();
  }

  if (typeof value === "string") {
    return value.split(",")[0]?.trim();
  }

  return "";
};

const getClientIp = (req) =>
  req.ip ||
  getForwardedIp(req.headers["x-forwarded-for"]) ||
  req.socket?.remoteAddress ||
  "unknown";

const createPublicRateLimiter = ({ windowMs, max }) => {
  const hits = new Map();

  const cleanup = () => {
    const now = Date.now();

    for (const [key, record] of hits.entries()) {
      if (record.resetAt <= now) {
        hits.delete(key);
      }
    }
  };

  setInterval(cleanup, windowMs).unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = getClientIp(req);
    const current = hits.get(key);

    if (!current || current.resetAt <= now) {
      hits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return next();
    }

    current.count += 1;

    if (current.count > max) {
      return res.status(429).json({
        message: RATE_LIMIT_MESSAGE,
      });
    }

    return next();
  };
};

const fifteenMinutes = 15 * 60 * 1000;

module.exports = {
  captchaRateLimit: createPublicRateLimiter({
    windowMs: fifteenMinutes,
    max: 30,
  }),
  publicSubmissionRateLimit: createPublicRateLimiter({
    windowMs: fifteenMinutes,
    max: 10,
  }),
  contactRateLimit: createPublicRateLimiter({
    windowMs: fifteenMinutes,
    max: 10,
  }),
};
