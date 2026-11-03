import nodemailer from "nodemailer";

const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
if (!password) {
  console.error("GMAIL_APP_PASSWORD is missing. Add it to .env.local before running this check.");
  process.exitCode = 1;
} else {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: process.env.GMAIL_USER || "andrino243@gmail.com", pass: password },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
    logger: false,
    debug: false,
  });
  try {
    // Verify TLS and authentication only; this check never sends an email.
    await transporter.verify();
    console.log("Gmail SMTP authentication succeeded. No email was sent.");
  } catch {
    console.error("Gmail SMTP authentication failed. Check the account and app password.");
    process.exitCode = 1;
  } finally {
    transporter.close();
  }
}
