require("dotenv").config();
const { sendMail } = require("./src/services/mailer");

async function main() {
    console.log("Testing real mailer service...");
    console.log({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        ignoreTLS: process.env.SMTP_IGNORE_TLS,
        requireTLS: process.env.SMTP_REQUIRE_TLS,
        auth: process.env.SMTP_AUTH,
        from: process.env.MAIL_FROM_EMAIL,
    });

    const info = await sendMail({
        to: process.env.MAIL_FROM_EMAIL,
        replyTo: "test@example.com",
        subject: "Zepter Careers real mailer service test",
        text: "Ovo je test preko stvarnog mailer.js servisa.",
        html: "<p>Ovo je test preko stvarnog <strong>mailer.js</strong> servisa.</p>",
        category: "Mailer Test",
    });

    console.log("Email sent:", info.messageId);
}

main().catch((error) => {
    console.error("MAILER SERVICE TEST ERROR:");
    console.error(error);
    process.exit(1);
});