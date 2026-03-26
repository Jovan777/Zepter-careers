const crypto = require("crypto");
const PhoneVerification = require("../models/PhoneVerification");
const { sendOtpSms } = require("../services/nthSmsService");

const OTP_TTL_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_PURPOSE = "job_alert";

const normalizePhone = (phone) => {
  return String(phone || "").trim();
};

const normalizePurpose = (purpose) => {
  const normalized = String(purpose || DEFAULT_PURPOSE).trim().toLowerCase();
  return normalized || DEFAULT_PURPOSE;
};

const generateOtpCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const hashValue = (value) => {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
};

const isExpired = (date) => {
  return !date || new Date(date).getTime() < Date.now();
};

const startPhoneVerification = async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    const normalizedPhone = normalizePhone(phone);
    const normalizedPurpose = normalizePurpose(purpose);

    if (!normalizedPhone) {
      return res.status(400).json({
        message: "Telefon je obavezan.",
      });
    }

    const now = new Date();

    let existingVerification = await PhoneVerification.findOne({
      phone: normalizedPhone,
      purpose: normalizedPurpose,
      isVerified: false,
    }).sort({ createdAt: -1 });

    if (
      existingVerification &&
      existingVerification.lastSentAt &&
      now.getTime() - new Date(existingVerification.lastSentAt).getTime() <
        RESEND_COOLDOWN_SECONDS * 1000
    ) {
      return res.status(429).json({
        message: "Sačekajte pre ponovnog slanja koda.",
      });
    }

    const otpCode = generateOtpCode();
    const otpCodeHash = hashValue(otpCode);
    const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000);

    if (existingVerification && !isExpired(existingVerification.expiresAt)) {
      existingVerification.otpCodeHash = otpCodeHash;
      existingVerification.expiresAt = expiresAt;
      existingVerification.attemptCount = 0;
      existingVerification.maxAttempts = DEFAULT_MAX_ATTEMPTS;
      existingVerification.resendCount += 1;
      existingVerification.lastSentAt = now;
      await existingVerification.save();
    } else {
      existingVerification = await PhoneVerification.create({
        phone: normalizedPhone,
        purpose: normalizedPurpose,
        otpCodeHash,
        expiresAt,
        attemptCount: 0,
        maxAttempts: DEFAULT_MAX_ATTEMPTS,
        resendCount: 0,
        lastSentAt: now,
        isVerified: false,
      });
    }

    await sendOtpSms({
      phone: normalizedPhone,
      message: `Vaš verifikacioni kod je: ${otpCode}`,
    });

    return res.status(200).json({
      message: "OTP kod je uspešno poslat.",
      verification: {
        phone: existingVerification.phone,
        purpose: existingVerification.purpose,
        expiresAt: existingVerification.expiresAt,
      },
    });
  } catch (error) {
    console.error("Greška u startPhoneVerification:", error);

    return res.status(500).json({
      message: "Greška pri pokretanju verifikacije telefona.",
      error: error.message,
    });
  }
};

const confirmPhoneVerification = async (req, res) => {
  try {
    const { phone, code, purpose } = req.body;

    const normalizedPhone = normalizePhone(phone);
    const normalizedPurpose = normalizePurpose(purpose);

    if (!normalizedPhone || !code) {
      return res.status(400).json({
        message: "Telefon i kod su obavezni.",
      });
    }

    const verification = await PhoneVerification.findOne({
      phone: normalizedPhone,
      purpose: normalizedPurpose,
      isVerified: false,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(404).json({
        message: "Aktivna verifikacija nije pronađena.",
      });
    }

    if (isExpired(verification.expiresAt)) {
      return res.status(410).json({
        message: "Verifikacioni kod je istekao.",
      });
    }

    if (verification.attemptCount >= verification.maxAttempts) {
      return res.status(429).json({
        message: "Previše neuspešnih pokušaja. Pokrenite novu verifikaciju.",
      });
    }

    verification.attemptCount += 1;

    const incomingHash = hashValue(code);

    if (incomingHash !== verification.otpCodeHash) {
      await verification.save();

      return res.status(400).json({
        message: "Kod nije ispravan.",
      });
    }

    verification.isVerified = true;
    verification.verifiedAt = new Date();
    await verification.save();

    return res.status(200).json({
      message: "Telefon je uspešno verifikovan.",
      verification: {
        phone: verification.phone,
        purpose: verification.purpose,
        isVerified: verification.isVerified,
        verifiedAt: verification.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Greška u confirmPhoneVerification:", error);

    return res.status(500).json({
      message: "Greška pri potvrdi verifikacije telefona.",
      error: error.message,
    });
  }
};

const resendPhoneVerification = async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    const normalizedPhone = normalizePhone(phone);
    const normalizedPurpose = normalizePurpose(purpose);

    if (!normalizedPhone) {
      return res.status(400).json({
        message: "phone je obavezan.",
      });
    }

    const verification = await PhoneVerification.findOne({
      phone: normalizedPhone,
      purpose: normalizedPurpose,
      isVerified: false,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(404).json({
        message: "Aktivna verifikacija nije pronađena.",
      });
    }

    const now = new Date();

    if (
      verification.lastSentAt &&
      now.getTime() - new Date(verification.lastSentAt).getTime() <
        RESEND_COOLDOWN_SECONDS * 1000
    ) {
      return res.status(429).json({
        message: "Sačekajte malo pre ponovnog slanja koda.",
      });
    }

    const otpCode = generateOtpCode();

    verification.otpCodeHash = hashValue(otpCode);
    verification.expiresAt = new Date(
      now.getTime() + OTP_TTL_MINUTES * 60 * 1000
    );
    verification.attemptCount = 0;
    verification.resendCount += 1;
    verification.lastSentAt = now;

    await verification.save();

    await sendOtpSms({
      phone: normalizedPhone,
      message: `Vaš novi verifikacioni kod je: ${otpCode}`,
    });

    return res.status(200).json({
      message: "Novi OTP kod je uspešno poslat.",
      verification: {
        phone: verification.phone,
        purpose: verification.purpose,
        expiresAt: verification.expiresAt,
      },
    });
  } catch (error) {
    console.error("Greška u resendPhoneVerification:", error);

    return res.status(500).json({
      message: "Greška pri ponovnom slanju OTP koda.",
      error: error.message,
    });
  }
};

module.exports = {
  startPhoneVerification,
  confirmPhoneVerification,
  resendPhoneVerification,
};