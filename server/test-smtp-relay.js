require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  ignoreTLS: true,
  logger: true,
  debug: true,
});

async function run() {
  console.log("SMTP relay config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    from: process.env.MAIL_FROM_EMAIL,
  });

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: "tvoj-test-email@gmail.com",
    subject: "Zepter Careers SMTP relay test",
    text: "Test SMTP relay slanja iz lokalnog backend-a.",
  });

  console.log("Relay test email sent");
}

run().catch((error) => {
  console.error("SMTP relay test failed:");
  console.error(error);
});