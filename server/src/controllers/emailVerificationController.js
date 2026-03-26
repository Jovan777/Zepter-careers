const crypto = require("crypto");
const EmailVerification = require("../models/EmailVerification");
const { sendVerificationEmail } = require("../services/emailSenderService");

const TOKEN_TTL_HOURS = 24;
const RESEND_COOLDOWN_SECONDS = 60;
const DEFAULT_PURPOSE = "job_alert";

const normalizeEmail = (email) => {
  return String(email || "").trim().toLowerCase();
};

const normalizePurpose = (purpose) => {
  const normalized = String(purpose || DEFAULT_PURPOSE).trim().toLowerCase();
  return normalized || DEFAULT_PURPOSE;
};

const hashValue = (value) => {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
};

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const getAppBaseUrl = () => {
  return process.env.APP_BASE_URL || "http://localhost:5000";
};

const isExpired = (date) => {
  return !date || new Date(date).getTime() < Date.now();
};

const startEmailVerification = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedPurpose = normalizePurpose(purpose);

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "email je obavezan.",
      });
    }

    const now = new Date();

    let existingVerification = await EmailVerification.findOne({
      email: normalizedEmail,
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
        message: "Sačekajte malo pre ponovnog slanja verifikacionog linka.",
      });
    }

    const token = generateToken();
    const tokenHash = hashValue(token);
    const expiresAt = new Date(
      now.getTime() + TOKEN_TTL_HOURS * 60 * 60 * 1000
    );

    if (existingVerification && !isExpired(existingVerification.expiresAt)) {
      existingVerification.tokenHash = tokenHash;
      existingVerification.expiresAt = expiresAt;
      existingVerification.resendCount += 1;
      existingVerification.lastSentAt = now;
      await existingVerification.save();
    } else {
      existingVerification = await EmailVerification.create({
        email: normalizedEmail,
        purpose: normalizedPurpose,
        tokenHash,
        expiresAt,
        resendCount: 0,
        lastSentAt: now,
        isVerified: false,
      });
    }

    const verificationLink = `${getAppBaseUrl()}/api/email-verification/confirm?token=${token}&purpose=${normalizedPurpose}`;

    await sendVerificationEmail({
      email: normalizedEmail,
      subject: "Potvrdite svoju email adresu",
      text: `Kliknite na sledeći link da potvrdite email adresu: ${verificationLink}`,
      html: `
        <p>Potvrdite svoju email adresu klikom na link ispod:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
      `,
    });

    return res.status(200).json({
      message: "Verifikacioni email je uspešno poslat.",
      verification: {
        email: existingVerification.email,
        purpose: existingVerification.purpose,
        expiresAt: existingVerification.expiresAt,
      },
    });
  } catch (error) {
    console.error("Greška u startEmailVerification:", error);

    return res.status(500).json({
      message: "Greška pri pokretanju email verifikacije.",
      error: error.message,
    });
  }
};

const confirmEmailVerification = async (req, res) => {
  try {
    const token = String(req.query.token || "").trim();
    const purpose = normalizePurpose(req.query.purpose);

    if (!token) {
      return res.status(400).json({
        message: "token je obavezan.",
      });
    }

    const tokenHash = hashValue(token);

    const verification = await EmailVerification.findOne({
      tokenHash,
      purpose,
      isVerified: false,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(404).json({
        message: "Verifikacioni token nije pronađen.",
      });
    }

    if (isExpired(verification.expiresAt)) {
      return res.status(410).json({
        message: "Verifikacioni link je istekao.",
      });
    }

    verification.isVerified = true;
    verification.verifiedAt = new Date();
    await verification.save();

    return res.status(200).json({
      message: "Email adresa je uspešno verifikovana.",
      verification: {
        email: verification.email,
        purpose: verification.purpose,
        isVerified: verification.isVerified,
        verifiedAt: verification.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Greška u confirmEmailVerification:", error);

    return res.status(500).json({
      message: "Greška pri potvrdi email verifikacije.",
      error: error.message,
    });
  }
};

const resendEmailVerification = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedPurpose = normalizePurpose(purpose);

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "email je obavezan.",
      });
    }

    const verification = await EmailVerification.findOne({
      email: normalizedEmail,
      purpose: normalizedPurpose,
      isVerified: false,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.status(404).json({
        message: "Aktivna email verifikacija nije pronađena.",
      });
    }

    const now = new Date();

    if (
      verification.lastSentAt &&
      now.getTime() - new Date(verification.lastSentAt).getTime() <
        RESEND_COOLDOWN_SECONDS * 1000
    ) {
      return res.status(429).json({
        message: "Sačekajte malo pre ponovnog slanja verifikacionog linka.",
      });
    }

    const token = generateToken();

    verification.tokenHash = hashValue(token);
    verification.expiresAt = new Date(
      now.getTime() + TOKEN_TTL_HOURS * 60 * 60 * 1000
    );
    verification.resendCount += 1;
    verification.lastSentAt = now;

    await verification.save();

    const verificationLink = `${getAppBaseUrl()}/api/email-verification/confirm?token=${token}&purpose=${normalizedPurpose}`;

    await sendVerificationEmail({
      email: normalizedEmail,
      subject: "Ponovno slanje verifikacionog emaila",
      text: `Kliknite na sledeći link da potvrdite email adresu: ${verificationLink}`,
      html: `
        <p>Ponovo šaljemo link za potvrdu email adrese:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
      `,
    });

    return res.status(200).json({
      message: "Verifikacioni email je ponovo poslat.",
      verification: {
        email: verification.email,
        purpose: verification.purpose,
        expiresAt: verification.expiresAt,
      },
    });
  } catch (error) {
    console.error("Greška u resendEmailVerification:", error);

    return res.status(500).json({
      message: "Greška pri ponovnom slanju email verifikacije.",
      error: error.message,
    });
  }
};

module.exports = {
  startEmailVerification,
  confirmEmailVerification,
  resendEmailVerification,
};