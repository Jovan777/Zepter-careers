require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

async function run() {
  console.log("SMTP config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    from: process.env.MAIL_FROM_EMAIL,
  });

  await transporter.verify();
  console.log("SMTP verify OK");

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: "tvoj-test-email@gmail.com",
    subject: "Zepter Careers SMTP test",
    text: "Test SMTP slanja iz lokalnog backend-a.",
  });

  console.log("Test email sent");
}

run().catch((error) => {
  console.error("SMTP test failed:");
  console.error(error);
});