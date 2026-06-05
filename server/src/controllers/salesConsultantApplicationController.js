const crypto = require("crypto");
const SalesConsultantApplication = require("../models/SalesConsultantApplication");
const { sendEmail } = require("../services/emailService");

const COUNTRY_LABELS = {
  serbia: "Srbija",
  bosnia: "Bosna i Hercegovina",
  croatia: "Hrvatska",
  montenegro: "Crna Gora",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }
  return false;
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const generatePublicId = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
    const publicId = `SC-${datePart}-${randomPart}`;
    const existing = await SalesConsultantApplication.exists({ publicId });

    if (!existing) {
      return publicId;
    }
  }

  return `SC-${datePart}-${Date.now()}`;
};

const buildNotificationEmail = ({ application, countryLabel }) => {
  const submittedAt = new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Belgrade",
  }).format(application.createdAt || new Date());

  const fullName = `${application.firstName} ${application.lastName}`.trim();
  const text = [
    "Nova prijava za konsultanta prodaje",
    "",
    `Public ID: ${application.publicId}`,
    `Ime i prezime: ${fullName}`,
    `Email: ${application.email}`,
    `Telefon: ${application.phone}`,
    `Država: ${countryLabel}`,
    `Grad: ${application.city || "-"}`,
    `CV: ${application.cvDocument?.fileUrl || "-"}`,
    `Datum slanja: ${submittedAt}`,
    "",
    "Poruka / motivacija:",
    application.message || "-",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102d54;">
      <h1 style="font-size:20px;">Nova prijava za konsultanta prodaje</h1>
      <p><strong>Public ID:</strong> ${escapeHtml(application.publicId)}</p>
      <p><strong>Ime i prezime:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(application.phone)}</p>
      <p><strong>Država:</strong> ${escapeHtml(countryLabel)}</p>
      <p><strong>Grad:</strong> ${escapeHtml(application.city || "-")}</p>
      <p><strong>CV:</strong> ${escapeHtml(application.cvDocument?.fileUrl || "-")}</p>
      <p><strong>Datum slanja:</strong> ${escapeHtml(submittedAt)}</p>
      <p><strong>Poruka / motivacija:</strong></p>
      <div style="padding:12px;border:1px solid #e5ecf5;border-radius:10px;background:#f8fbff;white-space:pre-wrap;">${escapeHtml(application.message || "-")}</div>
    </div>
  `;

  return {
    subject: "Zepter Careers - nova prijava za konsultanta prodaje",
    text,
    html,
  };
};

const sendSalesConsultantNotification = async ({ application, countryLabel }) => {
  const to = process.env.MAIL_FROM_EMAIL || "karijera@zepter.rs";

  await sendEmail({
    to,
    replyTo: application.email,
    category: "Sales Consultant Applications",
    ...buildNotificationEmail({ application, countryLabel }),
  });
};

const submitSalesConsultantApplication = async (req, res) => {
  try {
    const firstName = normalizeString(req.body.firstName);
    const lastName = normalizeString(req.body.lastName);
    const email = normalizeString(req.body.email).toLowerCase();
    const phone = normalizeString(req.body.phone);
    const country = normalizeString(req.body.country);
    const city = normalizeString(req.body.city);
    const message = normalizeString(req.body.message || req.body.motivation);
    const acceptedTerms = normalizeBoolean(req.body.acceptedTerms);
    const marketingConsent = normalizeBoolean(req.body.marketingConsent);

    if (!firstName) {
      return res.status(400).json({ message: "Ime je obavezno." });
    }

    if (!lastName) {
      return res.status(400).json({ message: "Prezime je obavezno." });
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Ispravna email adresa je obavezna." });
    }

    if (!phone) {
      return res.status(400).json({ message: "Broj telefona je obavezan." });
    }

    if (!COUNTRY_LABELS[country]) {
      return res.status(400).json({ message: "Država nije validna." });
    }

    if (!acceptedTerms) {
      return res.status(400).json({
        message: "Prihvatanje uslova korišćenja i politike privatnosti je obavezno.",
      });
    }

    const now = new Date();
    const cvDocument = req.file
      ? {
          fileName: req.file.originalname,
          fileUrl: `/uploads/applications/${req.file.filename}`,
        }
      : {
          fileName: "",
          fileUrl: "",
        };

    const application = await SalesConsultantApplication.create({
      publicId: await generatePublicId(),
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      message,
      motivation: message,
      cvDocument,
      acceptedTerms,
      acceptedTermsAt: now,
      marketingConsent,
      status: "new",
      reason: "",
      events: [
        {
          type: "created",
          timestamp: now,
          data: {
            country,
            city,
            cvUrl: cvDocument.fileUrl,
          },
        },
      ],
    });

    try {
      await sendSalesConsultantNotification({
        application,
        countryLabel: COUNTRY_LABELS[country],
      });
    } catch (emailError) {
      console.error(
        `Greška pri slanju email obaveštenja za prijavu konsultanta ${application.publicId}:`,
        emailError.message
      );
    }

    return res.status(201).json({
      message:
        "Vaša prijava za konsultanta prodaje je uspešno poslata. Naš tim će vas kontaktirati u najkraćem roku.",
      application: {
        publicId: application.publicId,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Greška u submitSalesConsultantApplication:", error);

    return res.status(500).json({
      message: "Greška pri slanju prijave za konsultanta prodaje.",
      error: error.message,
    });
  }
};

module.exports = {
  submitSalesConsultantApplication,
};
