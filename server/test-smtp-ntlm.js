require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 25),
  secure: false,
  ignoreTLS: true,

  authMethod: "NTLM",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    domain: "ZGROUP",
    workstation: "ZEPTER-CAREERS",
  },

  logger: true,
  debug: true,
});

async function run() {
  console.log("SMTP NTLM config:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: process.env.MAIL_FROM_EMAIL,
    authMethod: "NTLM",
  });

  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to: "tvoj-test-email@gmail.com",
    subject: "Zepter Careers SMTP NTLM test",
    text: "Test SMTP NTLM slanja iz lokalnog backend-a.",
  });

  console.log("NTLM test email sent");
}

run().catch((error) => {
  console.error("SMTP NTLM test failed:");
  console.error(error);
});