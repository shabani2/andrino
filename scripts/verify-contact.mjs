import assert from "node:assert/strict";
import { validateContact, contactSubjects } from "../src/lib/contact-validation.ts";
import { sendContactEmail } from "../src/lib/email.ts";
import nodemailer from "nodemailer";

const valid = { name: "Editorial QA", email: "qa@example.com", subject: contactSubjects[0], message: "A local test message for an editorial project.", consent: true };
assert.deepEqual(validateContact(valid), {});
assert.equal(Object.keys(validateContact({ name: "", email: "invalid", subject: "other", message: "short", consent: false })).length, 5);
assert.ok(validateContact({ ...valid, message: " ".repeat(30) }).message);
assert.ok(validateContact({ ...valid, message: "a".repeat(2501) }).message);

const originalCreateTransport = nodemailer.createTransport;
const originalEnvironment = { GMAIL_USER: process.env.GMAIL_USER, GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD, CONTACT_EMAIL: process.env.CONTACT_EMAIL };
try {
  delete process.env.GMAIL_APP_PASSWORD;
  let called = false;
  nodemailer.createTransport = () => { called = true; throw new Error("Unexpected SMTP connection"); };
  assert.equal((await sendContactEmail(valid)).status, "error");
  assert.equal(called, false);

  process.env.GMAIL_USER = "sender@gmail.com";
  process.env.GMAIL_APP_PASSWORD = "abcd efgh ijkl mnop";
  process.env.CONTACT_EMAIL = "recipient@example.com";
  nodemailer.createTransport = (options) => {
    assert.equal(options.host, "smtp.gmail.com");
    assert.equal(options.port, 465);
    assert.equal(options.secure, true);
    assert.deepEqual(options.auth, { user: "sender@gmail.com", pass: "abcdefghijklmnop" });
    return { sendMail: async (payload) => {
      assert.equal(payload.from.address, "sender@gmail.com");
      assert.equal(payload.replyTo.address, valid.email);
      assert.equal(payload.to, "recipient@example.com");
      assert.ok(payload.text.includes(valid.message));
      assert.equal(payload.disableFileAccess, true);
      assert.equal(payload.disableUrlAccess, true);
      return { messageId: "mocked-smtp-id", accepted: ["recipient@example.com"], rejected: [] };
    } };
  };
  assert.equal((await sendContactEmail(valid)).status, "success");
  delete process.env.CONTACT_EMAIL;
  nodemailer.createTransport = () => ({ sendMail: async (payload) => {
    assert.equal(payload.to, "andrino243@gmail.com");
    return { messageId: "mocked-owner-id", accepted: ["andrino243@gmail.com"], rejected: [] };
  } });
  assert.equal((await sendContactEmail(valid)).status, "success");
  nodemailer.createTransport = () => ({ sendMail: async () => ({ messageId: "rejected", accepted: [], rejected: ["andrino243@gmail.com"] }) });
  assert.equal((await sendContactEmail(valid)).status, "error");
  nodemailer.createTransport = () => ({ sendMail: async () => ({ accepted: ["andrino243@gmail.com"], rejected: [] }) });
  assert.equal((await sendContactEmail(valid)).status, "error");
  nodemailer.createTransport = () => ({ sendMail: async () => { throw new Error("SMTP authentication failed"); } });
  assert.equal((await sendContactEmail(valid)).status, "error");
  console.log("Contact validation and mocked Gmail SMTP scenarios passed. No email was sent.");
} finally {
  nodemailer.createTransport = originalCreateTransport;
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
}
