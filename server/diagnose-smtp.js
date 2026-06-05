const path = require("path");
const dns = require("dns").promises;
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config({ path: path.join(__dirname, ".env") });

const SMTP_HOST = String(process.env.SMTP_HOST || "mail2.zepter.rs").trim();
const MAIL_FROM_EMAIL = String(
  process.env.MAIL_FROM_EMAIL || "karijera@zepter.rs"
).trim();
const MAIL_FROM_NAME = String(
  process.env.MAIL_FROM_NAME || "Zepter Careers"
).trim();
const SMTP_USER = String(process.env.SMTP_USER || "").trim();
const SMTP_PASS = String(process.env.SMTP_PASS || "");

const args = new Set(process.argv.slice(2));
const continueAll = args.has("--all") || args.has("--continue");
const includePort25 = args.has("--include-25");
const timeoutMs = Number.parseInt(process.env.DIAG_SMTP_TIMEOUT_MS || "10000", 10);

const TLS_MIN_VERSIONS = [null, "TLSv1.2", "TLSv1.1", "TLSv1"];

const CONNECTION_VARIANTS = [
  {
    label: "direct TLS",
    secure: true,
    ignoreTLS: false,
    requireTLS: false,
    tlsMinVersions: TLS_MIN_VERSIONS,
  },
  {
    label: "opportunistic STARTTLS",
    secure: false,
    ignoreTLS: false,
    requireTLS: false,
    tlsMinVersions: TLS_MIN_VERSIONS,
  },
  {
    label: "required STARTTLS",
    secure: false,
    ignoreTLS: false,
    requireTLS: true,
    tlsMinVersions: TLS_MIN_VERSIONS,
  },
  {
    label: "plain SMTP / ignore TLS",
    secure: false,
    ignoreTLS: true,
    requireTLS: false,
    tlsMinVersions: [null],
  },
];

const authOptions = [true, false];

const ports = [
  { port: 465, note: "external SMTPS/submission candidate" },
  { port: 587, note: "external submission candidate" },
  ...(includePort25
    ? [{ port: 25, note: "internal relay only; often blocked externally" }]
    : []),
];

const formatBool = (value) => (value ? "true" : "false");

const formatTlsMinVersion = (value) => value || "default";

const fromAddress = () =>
  `"${MAIL_FROM_NAME.replace(/"/g, '\\"')}" <${MAIL_FROM_EMAIL}>`;

const safeError = (error) => ({
  message: error?.message,
  code: error?.code,
  command: error?.command,
  response: error?.response,
  responseCode: error?.responseCode,
});

const classifyFailure = (error) => {
  const message = String(error?.message || "").toLowerCase();
  const response = String(error?.response || "").toLowerCase();
  const code = String(error?.code || "").toUpperCase();
  const responseCode = Number(error?.responseCode || 0);
  const combined = `${message} ${response}`;

  if (
    [530, 550, 553, 554, 571, 572, 573, 574, 557].includes(responseCode) ||
    combined.includes("relay") ||
    combined.includes("anonymous mail") ||
    combined.includes("mail from") ||
    combined.includes("not authenticated to send")
  ) {
    return "relay permission";
  }

  if (
    [504, 534, 535, 538].includes(responseCode) ||
    combined.includes("unrecognized authentication type") ||
    combined.includes("invalid login") ||
    combined.includes("authentication") ||
    combined.includes("auth")
  ) {
    return "auth";
  }

  if (
    ["EPROTO", "ECERT", "ETLS"].includes(code) ||
    combined.includes("wrong version number") ||
    combined.includes("ssl") ||
    combined.includes("tls") ||
    combined.includes("certificate")
  ) {
    return "tls";
  }

  if (
    ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ETIMEDOUT", "ECONNRESET", "ESOCKET"].includes(code) ||
    combined.includes("timeout") ||
    combined.includes("network socket disconnected") ||
    combined.includes("connection closed")
  ) {
    return "network";
  }

  return "unknown";
};

const createTransportConfig = (test) => {
  const tls = {
    servername: SMTP_HOST,
  };

  if (test.tlsMinVersion) {
    tls.minVersion = test.tlsMinVersion;
  }

  const config = {
    host: SMTP_HOST,
    port: test.port,
    secure: test.secure,
    ignoreTLS: test.ignoreTLS,
    requireTLS: test.requireTLS,
    connectionTimeout: timeoutMs,
    greetingTimeout: timeoutMs,
    socketTimeout: timeoutMs,
    tls,
  };

  if (test.authUsed) {
    config.auth = {
      user: SMTP_USER,
      pass: SMTP_PASS,
    };
  }

  return config;
};

const createTests = () => {
  const tests = [];

  for (const portConfig of ports) {
    for (const variant of CONNECTION_VARIANTS) {
      for (const tlsMinVersion of variant.tlsMinVersions) {
        for (const authUsed of authOptions) {
          tests.push({
            name: `${portConfig.port} ${variant.label} ${authUsed ? "auth" : "no-auth"} TLS=${formatTlsMinVersion(tlsMinVersion)}`,
            port: portConfig.port,
            portNote: portConfig.note,
            secure: variant.secure,
            ignoreTLS: variant.ignoreTLS,
            requireTLS: variant.requireTLS,
            authUsed,
            tlsMinVersion,
          });
        }
      }
    }
  }

  return tests;
};

const printTestConfig = (test) => {
  console.log(`\nTEST: ${test.name}`);
  console.log(`  host: ${SMTP_HOST}`);
  console.log(`  port: ${test.port} (${test.portNote})`);
  console.log(`  secure: ${formatBool(test.secure)}`);
  console.log(`  ignoreTLS: ${formatBool(test.ignoreTLS)}`);
  console.log(`  requireTLS: ${formatBool(test.requireTLS)}`);
  console.log(`  authUsed: ${formatBool(test.authUsed)}`);
  console.log(`  tlsMinVersion: ${formatTlsMinVersion(test.tlsMinVersion)}`);
};

const printWorkingConfiguration = (test) => {
  console.log("\nWORKING SMTP CONFIGURATION FOUND:\n");
  console.log(`SMTP_HOST=${SMTP_HOST}`);
  console.log(`SMTP_PORT=${test.port}`);
  console.log(`SMTP_SECURE=${formatBool(test.secure)}`);
  console.log(`SMTP_IGNORE_TLS=${formatBool(test.ignoreTLS)}`);
  console.log(`SMTP_REQUIRE_TLS=${formatBool(test.requireTLS)}`);
  console.log(`SMTP_AUTH=${formatBool(test.authUsed)}`);
  console.log(`SMTP_TLS_MIN_VERSION=${test.tlsMinVersion || ""}`);
  console.log(`SMTP_USER=${test.authUsed ? SMTP_USER || "<set SMTP_USER>" : ""}`);
  console.log("SMTP_PASS=<keep existing secret value, do not print>");
  console.log("\nUse this configuration in production env.");
};

const testSmtpConfig = async (test) => {
  printTestConfig(test);

  if (test.authUsed && (!SMTP_USER || !SMTP_PASS)) {
    const error = new Error("SMTP_USER or SMTP_PASS is missing; skipping auth test.");
    error.code = "MISSING_AUTH_ENV";
    throw error;
  }

  const transporter = nodemailer.createTransport(createTransportConfig(test));

  console.log("  verify(): starting");
  await transporter.verify();
  console.log("  verify(): OK");

  console.log(`  sendMail(): sending test email to ${MAIL_FROM_EMAIL}`);
  await transporter.sendMail({
    from: fromAddress(),
    to: MAIL_FROM_EMAIL,
    replyTo: "test@example.com",
    subject: `Zepter Careers SMTP diagnostic - ${test.name}`,
    text: [
      "Zepter Careers SMTP diagnostic email.",
      "",
      `Host: ${SMTP_HOST}`,
      `Port: ${test.port}`,
      `Secure: ${formatBool(test.secure)}`,
      `ignoreTLS: ${formatBool(test.ignoreTLS)}`,
      `requireTLS: ${formatBool(test.requireTLS)}`,
      `authUsed: ${formatBool(test.authUsed)}`,
      `tlsMinVersion: ${formatTlsMinVersion(test.tlsMinVersion)}`,
      "",
      "If you received this email, this SMTP configuration can send from the backend.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102d54;">
        <h1 style="font-size:20px;">Zepter Careers SMTP diagnostic email</h1>
        <p>If you received this email, this SMTP configuration can send from the backend.</p>
        <ul>
          <li><strong>Host:</strong> ${SMTP_HOST}</li>
          <li><strong>Port:</strong> ${test.port}</li>
          <li><strong>Secure:</strong> ${formatBool(test.secure)}</li>
          <li><strong>ignoreTLS:</strong> ${formatBool(test.ignoreTLS)}</li>
          <li><strong>requireTLS:</strong> ${formatBool(test.requireTLS)}</li>
          <li><strong>authUsed:</strong> ${formatBool(test.authUsed)}</li>
          <li><strong>tlsMinVersion:</strong> ${formatTlsMinVersion(test.tlsMinVersion)}</li>
        </ul>
      </div>
    `,
  });
  console.log("  sendMail(): OK");
};

const printFailureSummary = (results) => {
  const failed = results.filter((result) => !result.success);
  const counts = failed.reduce((acc, result) => {
    acc[result.failureType] = (acc[result.failureType] || 0) + 1;
    return acc;
  }, {});

  console.log("\nSMTP DIAGNOSTIC SUMMARY");
  console.log("=======================");
  console.log("No working SMTP configuration was found.");
  console.log(`Total failed tests: ${failed.length}`);
  console.log(`Network failures: ${counts.network || 0}`);
  console.log(`TLS failures: ${counts.tls || 0}`);
  console.log(`Authentication failures: ${counts.auth || 0}`);
  console.log(`Relay permission failures: ${counts["relay permission"] || 0}`);
  console.log(`Unknown failures: ${counts.unknown || 0}`);

  const mostRecentByType = new Map();
  for (const result of failed) {
    mostRecentByType.set(result.failureType, result);
  }

  for (const [failureType, result] of mostRecentByType.entries()) {
    console.log(`\nLast ${failureType} failure:`);
    console.log(JSON.stringify(result.error, null, 2));
  }

  console.log(
    "\nConclusion: no tested external SMTP mode was accepted. Zepter IT must provide the exact production SMTP parameters or whitelist the production server for relay."
  );
  console.log(
    "If port 25 works only inside the Zepter network, production must run from that network/VPN or be explicitly allowed by Zepter IT."
  );
};

const printHeader = async () => {
  console.log("Zepter Careers SMTP diagnostic");
  console.log("==============================");
  console.log(`Host: ${SMTP_HOST}`);
  console.log(`MAIL_FROM_EMAIL: ${MAIL_FROM_EMAIL}`);
  console.log(`MAIL_FROM_NAME: ${MAIL_FROM_NAME}`);
  console.log(`SMTP_USER: ${SMTP_USER || "<not set>"}`);
  console.log("SMTP_PASS: <hidden>");
  console.log(`Timeout per phase: ${timeoutMs}ms`);
  console.log(`Mode: ${continueAll ? "continue all tests" : "stop at first successful send"}`);
  console.log(`Port 25 tests: ${includePort25 ? "included (internal relay only)" : "skipped (use --include-25 to test internal relay)"}`);

  try {
    const records = await dns.lookup(SMTP_HOST, { all: true });
    console.log(
      `DNS: ${records.map((record) => `${record.address}/IPv${record.family}`).join(", ")}`
    );
  } catch (error) {
    console.log(`DNS lookup failed: ${error.message}`);
  }
};

const main = async () => {
  await printHeader();

  const tests = createTests();
  const results = [];

  for (const test of tests) {
    try {
      await testSmtpConfig(test);

      results.push({
        test,
        success: true,
      });

      printWorkingConfiguration(test);

      if (!continueAll) {
        return;
      }
    } catch (error) {
      const failureType = classifyFailure(error);
      const safe = safeError(error);
      results.push({
        test,
        success: false,
        failureType,
        error: safe,
      });

      console.log(`  FAILED (${failureType})`);
      console.log(`  error: ${JSON.stringify(safe)}`);
    }
  }

  const success = results.find((result) => result.success);

  if (success) {
    printWorkingConfiguration(success.test);
    return;
  }

  printFailureSummary(results);
  process.exitCode = 1;
};

main().catch((error) => {
  console.error("Unexpected diagnostic failure:");
  console.error(JSON.stringify(safeError(error), null, 2));
  process.exitCode = 1;
});
