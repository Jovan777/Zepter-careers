require("dotenv").config();
const nodemailer = require("nodemailer");

const baseConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
};

const from = `"${process.env.MAIL_FROM_NAME || "Zepter Careers"}" <${
  process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER
}>`;

const to = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;

const tests = [
  {
    name: "secure=false + STARTTLS default + auth",
    config: {
      ...baseConfig,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
  {
    name: "secure=false + ignoreTLS=true + auth",
    config: {
      ...baseConfig,
      secure: false,
      ignoreTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
  {
    name: "secure=false + ignoreTLS=true + no auth",
    config: {
      ...baseConfig,
      secure: false,
      ignoreTLS: true,
    },
  },
  {
    name: "secure=false + requireTLS=false + auth",
    config: {
      ...baseConfig,
      secure: false,
      requireTLS: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
  {
    name: "secure=false + requireTLS=true + auth",
    config: {
      ...baseConfig,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
];

async function runTest(test) {
  console.log("\n==============================");
  console.log(`TEST: ${test.name}`);
  console.log("==============================");

  console.log({
    host: test.config.host,
    port: test.config.port,
    secure: test.config.secure,
    ignoreTLS: test.config.ignoreTLS,
    requireTLS: test.config.requireTLS,
    authUsed: Boolean(test.config.auth),
    user: test.config.auth?.user || null,
    from,
    to,
  });

  const transporter = nodemailer.createTransport(test.config);

  await transporter.verify();
  console.log("SMTP verify OK");

  const info = await transporter.sendMail({
    from,
    to,
    replyTo: "test@example.com",
    subject: `Zepter Careers SMTP test — ${test.name}`,
    text: `Ovo je test SMTP slanja iz Zepter Careers aplikacije.\n\nTest: ${test.name}`,
    html: `
      <p>Ovo je test SMTP slanja iz <strong>Zepter Careers</strong> aplikacije.</p>
      <p><strong>Test:</strong> ${test.name}</p>
    `,
  });

  console.log("Email sent:", info.messageId);
}

async function main() {
  console.log("SMTP diagnostic started.");
  console.log("SMTP_PASS will not be printed.");

  for (const test of tests) {
    try {
      await runTest(test);
      console.log(`SUCCESS: ${test.name}`);
      return;
    } catch (error) {
      console.error(`FAILED: ${test.name}`);
      console.error({
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
      });
    }
  }

  console.error("\nAll SMTP tests failed.");
  process.exit(1);
}

main();