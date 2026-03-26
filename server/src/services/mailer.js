const { MailtrapClient } = require("mailtrap");

const getClient = () => {
  const token = process.env.MAILTRAP_API_TOKEN;

  if (!token || !String(token).trim()) {
    throw new Error("MAILTRAP_API_TOKEN nije podešen u .env.");
  }

  return new MailtrapClient({
    token: String(token).trim(),
  });
};

const sendMail = async ({ to, subject, text, html }) => {
  const client = getClient();

  const normalizedRecipients = Array.isArray(to)
    ? to.map((email) => (typeof email === "string" ? { email } : email))
    : [{ email: to }];

  return client.send({
    from: {
      email: process.env.MAIL_FROM_EMAIL || "hello@demomailtrap.co",
      name: process.env.MAIL_FROM_NAME || "Zepter Careers",
    },
    to: normalizedRecipients,
    subject,
    text,
    html,
    category: "Job Alerts",
  });
};

module.exports = {
  sendMail,
};