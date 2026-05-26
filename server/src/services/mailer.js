const { MailtrapClient } = require("mailtrap");
const nodemailer = require("nodemailer");

const getFromEmail = () => process.env.MAIL_FROM_EMAIL || "karijera@zepter.rs";
const getFromName = () => process.env.MAIL_FROM_NAME || "Zepter Careers";

const getSmtpHost = () => String(process.env.SMTP_HOST || "").trim();

const hasSmtpConfig = () => Boolean(getSmtpHost());

const getClient = () => {
  const token = process.env.MAILTRAP_API_TOKEN;

  if (!token || !String(token).trim()) {
    throw new Error("MAILTRAP_API_TOKEN nije podešen u .env.");
  }

  return new MailtrapClient({
    token: String(token).trim(),
  });
};

const normalizeMailtrapRecipients = (to) =>
  Array.isArray(to)
    ? to.map((email) => (typeof email === "string" ? { email } : email))
    : [{ email: to }];

const normalizeSmtpRecipients = (to) =>
  Array.isArray(to)
    ? to.map((recipient) =>
      typeof recipient === "string" ? recipient : recipient.email
    )
    : to;

const getSmtpTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const transportConfig = {
    host: getSmtpHost(),
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
  };

  if (smtpUser && smtpPass) {
    transportConfig.auth = {
      user: smtpUser,
      pass: smtpPass,
    };
  }

  return nodemailer.createTransport(transportConfig);
};

const sendSmtpMail = async ({ to, subject, text, html }) => {
  const transporter = getSmtpTransporter();
  const from = `"${getFromName()}" <${getFromEmail()}>`;

  return transporter.sendMail({
    from,
    to: normalizeSmtpRecipients(to),
    subject,
    text,
    html,
  });
};

const sendMailtrapMail = async ({ to, subject, text, html, category }) => {
  const client = getClient();

  return client.send({
    from: {
      email: getFromEmail(),
      name: getFromName(),
    },
    to: normalizeMailtrapRecipients(to),
    subject,
    text,
    html,
    category,
  });
};

const sendMail = async ({ to, subject, text, html, category = "Zepter Careers" }) => {
  if (hasSmtpConfig()) {
    return sendSmtpMail({
      to,
      subject,
      text,
      html,
    });
  }

  return sendMailtrapMail({
    to,
    subject,
    text,
    html,
    category,
  });
};

module.exports = {
  sendMail,
};
