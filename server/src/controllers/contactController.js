const { sendEmail } = require("../services/emailService");
const ContactMessage = require("../models/ContactMessage");

const CONTACT_TO_EMAIL = "karijera@zepter.rs";

const COUNTRY_LABELS = {
  serbia: "Srbija",
  bosnia: "Bosna i Hercegovina",
  croatia: "Hrvatska",
  montenegro: "Crna Gora",
};

const CONTACT_REASON_LABELS = {
  support: "Podrška",
  complaint: "Primedbe",
  question: "Pitanja",
  career: "Karijera",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatSubmittedAt = (date) =>
  new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Belgrade",
  }).format(date);

const buildContactEmail = ({
  firstName,
  lastName,
  email,
  phone,
  countryLabel,
  contactReasonLabel,
  message,
  submittedAt,
}) => {
  const subject = `Zepter Careers kontakt forma — ${contactReasonLabel}`;
  const fullName = `${firstName} ${lastName}`.trim();
  const submittedAtLabel = formatSubmittedAt(submittedAt);

  const text = [
    "Nova poruka sa Zepter Careers kontakt forme",
    "",
    `Ime i prezime: ${fullName}`,
    `Email: ${email}`,
    `Broj telefona: ${phone}`,
    `Država: ${countryLabel}`,
    `Razlog kontaktiranja: ${contactReasonLabel}`,
    `Datum slanja: ${submittedAtLabel}`,
    "",
    "Poruka:",
    message,
    "",
    "Ova poruka je poslata sa Zepter Careers website-a.",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Montserrat,Arial,sans-serif;color:#102d54;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dde5ef;border-radius:18px;overflow:hidden;box-shadow:0 18px 44px rgba(16,45,84,0.08);">
        <div style="padding:24px 28px;border-bottom:1px solid #e5ebf4;">
          <p style="margin:0 0 6px;color:#b59c68;font-size:13px;font-weight:700;text-transform:uppercase;">Zepter Careers</p>
          <h1 style="margin:0;color:#102d54;font-size:24px;line-height:1.3;">Nova poruka sa Zepter Careers kontakt forme</h1>
        </div>
        <div style="padding:24px 28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="padding:10px 0;width:180px;color:#657892;font-size:13px;font-weight:700;">Ime i prezime</td>
                <td style="padding:10px 0;color:#102d54;font-size:14px;">${escapeHtml(fullName)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#657892;font-size:13px;font-weight:700;">Email</td>
                <td style="padding:10px 0;color:#102d54;font-size:14px;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#657892;font-size:13px;font-weight:700;">Broj telefona</td>
                <td style="padding:10px 0;color:#102d54;font-size:14px;">${escapeHtml(phone)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#657892;font-size:13px;font-weight:700;">Država</td>
                <td style="padding:10px 0;color:#102d54;font-size:14px;">${escapeHtml(countryLabel)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#657892;font-size:13px;font-weight:700;">Razlog kontaktiranja</td>
                <td style="padding:10px 0;color:#102d54;font-size:14px;">${escapeHtml(contactReasonLabel)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#657892;font-size:13px;font-weight:700;">Datum slanja</td>
                <td style="padding:10px 0;color:#102d54;font-size:14px;">${escapeHtml(submittedAtLabel)}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top:22px;">
            <p style="margin:0 0 8px;color:#657892;font-size:13px;font-weight:700;">Poruka</p>
            <div style="padding:16px;border-radius:14px;background:#f8fbff;border:1px solid #e5ecf5;color:#102d54;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(message)}</div>
          </div>
        </div>
        <div style="padding:16px 28px;background:#fbfdff;border-top:1px solid #e5ebf4;">
          <p style="margin:0;color:#657892;font-size:12px;line-height:1.5;">Ova poruka je poslata sa Zepter Careers website-a.</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html, text };
};

const submitContactMessage = async (req, res) => {
  try {
    const firstName = normalizeString(req.body.firstName);
    const lastName = normalizeString(req.body.lastName);
    const email = normalizeString(req.body.email).toLowerCase();
    const phone = normalizeString(req.body.phone);
    const country = normalizeString(req.body.country);
    const contactReason = normalizeString(req.body.contactReason);
    const message = normalizeString(req.body.message);
    const sourcePage =
      normalizeString(req.body.sourcePage) ||
      normalizeString(req.get("referer")) ||
      "/contact";

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

    if (!CONTACT_REASON_LABELS[contactReason]) {
      return res.status(400).json({ message: "Razlog kontaktiranja nije validan." });
    }

    if (!message) {
      return res.status(400).json({ message: "Poruka je obavezna." });
    }

    const contactMessage = await ContactMessage.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      country,
      countryLabel: COUNTRY_LABELS[country],
      reason: contactReason,
      reasonLabel: CONTACT_REASON_LABELS[contactReason],
      message,
      sourcePage,
      status: "new",
    });

    const emailPayload = buildContactEmail({
      firstName,
      lastName,
      email,
      phone,
      countryLabel: COUNTRY_LABELS[country],
      contactReasonLabel: CONTACT_REASON_LABELS[contactReason],
      message,
      submittedAt: contactMessage.createdAt || new Date(),
    });

    try {
      await sendEmail({
        to: CONTACT_TO_EMAIL,
        replyTo: email,
        category: "Contact Form",
        ...emailPayload,
      });
    } catch (emailError) {
      console.error("Kontakt poruka je sacuvana, ali email nije poslat:", {
        contactMessageId: contactMessage._id,
        message: emailError.message,
        code: emailError.code,
      });
    }

    return res.status(200).json({
      contactMessageId: contactMessage._id,
      message: "Vaša poruka je uspešno poslata.",
    });
  } catch (error) {
    console.error("Greška u submitContactMessage:", error);

    return res.status(500).json({
      message: "Greška pri slanju poruke. Pokušajte ponovo kasnije.",
    });
  }
};

module.exports = {
  submitContactMessage,
};
