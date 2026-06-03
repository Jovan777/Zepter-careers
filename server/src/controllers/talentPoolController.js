const crypto = require("crypto");
const TalentPoolApplication = require("../models/TalentPoolApplication");

const AREA_OF_INTEREST_OPTIONS =
  TalentPoolApplication.TALENT_POOL_AREA_OF_INTEREST;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }
  return false;
};

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const generateTalentPoolPublicId = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    const publicId = `TP-${datePart}-${randomPart}`;
    const existing = await TalentPoolApplication.exists({ publicId });

    if (!existing) {
      return publicId;
    }
  }

  return `TP-${datePart}-${Date.now()}`;
};

const submitTalentPoolApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      areaOfInterest,
      message,
      acceptedTerms,
      marketingConsent,
      locale,
    } = req.body;

    const normalizedFirstName = normalizeString(firstName);
    const normalizedLastName = normalizeString(lastName);
    const normalizedEmail = normalizeString(email).toLowerCase();
    const normalizedAreaOfInterest = normalizeString(areaOfInterest);
    const acceptedTermsValue = normalizeBoolean(acceptedTerms);
    const marketingConsentValue = normalizeBoolean(marketingConsent);

    if (!normalizedFirstName) {
      return res.status(400).json({ message: "Ime je obavezno." });
    }

    if (!normalizedLastName) {
      return res.status(400).json({ message: "Prezime je obavezno." });
    }

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Ispravna email adresa je obavezna." });
    }

    if (!AREA_OF_INTEREST_OPTIONS.includes(normalizedAreaOfInterest)) {
      return res.status(400).json({ message: "Oblast interesovanja nije validna." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "CV je obavezan." });
    }

    if (!acceptedTermsValue) {
      return res.status(400).json({
        message: "Prihvatanje uslova korišćenja i politike privatnosti je obavezno.",
      });
    }

    const now = new Date();
    const cvDocument = {
      fileName: req.file.originalname,
      fileUrl: `/uploads/applications/${req.file.filename}`,
    };

    const application = await TalentPoolApplication.create({
      publicId: await generateTalentPoolPublicId(),
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: normalizedEmail,
      phone: normalizeString(phone),
      areaOfInterest: normalizedAreaOfInterest,
      message: normalizeString(message),
      cvDocument,
      acceptedTerms: acceptedTermsValue,
      acceptedTermsAt: acceptedTermsValue ? now : null,
      marketingConsent: marketingConsentValue,
      sourceLocale: normalizeString(locale) || "sr",
      status: "new",
      reason: "",
      events: [
        {
          type: "created",
          timestamp: now,
          data: {
            areaOfInterest: normalizedAreaOfInterest,
            cvUrl: cvDocument.fileUrl,
            sourceLocale: normalizeString(locale) || "sr",
          },
        },
      ],
    });

    return res.status(201).json({
      message: "Vaša otvorena prijava je uspešno poslata.",
      application: {
        publicId: application.publicId,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Greška u submitTalentPoolApplication:", error);

    return res.status(500).json({
      message: "Greška pri slanju otvorene prijave.",
      error: error.message,
    });
  }
};

module.exports = {
  submitTalentPoolApplication,
};
