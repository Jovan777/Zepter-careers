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

const getBooleanEnv = (name, defaultValue = false) => {
  const value = process.env[name];

  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return String(value).trim().toLowerCase() === "true";
};

const getSmtpTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const smtpAuthEnabled = getBooleanEnv("SMTP_AUTH", Boolean(smtpUser && smtpPass));
  const smtpTlsMinVersion = String(process.env.SMTP_TLS_MIN_VERSION || "").trim();
  const tlsConfig = {
    servername: getSmtpHost(),
  };

  if (smtpTlsMinVersion) {
    tlsConfig.minVersion = smtpTlsMinVersion;
  }

  const transportConfig = {
    host: getSmtpHost(),
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: getBooleanEnv("SMTP_SECURE", false),
    ignoreTLS: getBooleanEnv("SMTP_IGNORE_TLS", false),
    requireTLS: getBooleanEnv("SMTP_REQUIRE_TLS", false),
    tls: tlsConfig,
  };

  if (smtpAuthEnabled) {
    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP_AUTH je uključen, ali SMTP_USER ili SMTP_PASS nisu podešeni.");
    }

    transportConfig.auth = {
      user: smtpUser,
      pass: smtpPass,
    };
  }

  return nodemailer.createTransport(transportConfig);
};

const sendSmtpMail = async ({ to, subject, text, html, replyTo }) => {
  const transporter = getSmtpTransporter();
  const from = `"${getFromName()}" <${getFromEmail()}>`;

  return transporter.sendMail({
    from,
    to: normalizeSmtpRecipients(to),
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
};

const sendMailtrapMail = async ({ to, subject, text, html, category, replyTo }) => {
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
    ...(replyTo ? { reply_to: { email: replyTo } } : {}),
  });
};

const sendMail = async ({ to, subject, text, html, category = "Zepter Careers", replyTo }) => {
  if (hasSmtpConfig()) {
    return sendSmtpMail({
      to,
      subject,
      text,
      html,
      replyTo,
    });
  }

  return sendMailtrapMail({
    to,
    subject,
    text,
    html,
    category,
    replyTo,
  });
};

module.exports = {
  sendMail,
};
