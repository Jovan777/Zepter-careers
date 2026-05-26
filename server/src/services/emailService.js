const { sendMail } = require("./mailer");

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to || !String(to).trim()) {
    throw new Error("Recipient email is required.");
  }

  return sendMail({
    to: String(to).trim(),
    subject,
    html,
    text,
  });
};

module.exports = {
  sendEmail,
};
