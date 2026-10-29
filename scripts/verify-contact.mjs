import assert from "node:assert/strict";
import { validateContact, contactSubjects } from "../src/lib/contact-validation.ts";
import { sendContactEmail } from "../src/lib/email.ts";

const valid = { name: "Editorial QA", email: "qa@example.com", subject: contactSubjects[0], message: "A local test message for an editorial project.", consent: true };
assert.deepEqual(validateContact(valid), {});
assert.equal(Object.keys(validateContact({ name: "", email: "invalid", subject: "other", message: "short", consent: false })).length, 5);
assert.ok(validateContact({ ...valid, message: " ".repeat(30) }).message);
assert.ok(validateContact({ ...valid, message: "a".repeat(2501) }).message);

const originalFetch = globalThis.fetch;
const originalEnvironment = { RESEND_API_KEY: process.env.RESEND_API_KEY, CONTACT_EMAIL: process.env.CONTACT_EMAIL, CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL };
try {
  delete process.env.RESEND_API_KEY;
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error("Unexpected network call"); };
  assert.equal((await sendContactEmail(valid)).status, "error");
  assert.equal(called, false);

  process.env.RESEND_API_KEY = "test-only-not-a-real-key";
  process.env.CONTACT_EMAIL = "recipient@example.com";
  process.env.CONTACT_FROM_EMAIL = "sender@example.com";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    const payload = JSON.parse(options.body);
    assert.equal(payload.reply_to, valid.email);
    assert.deepEqual(payload.to, ["recipient@example.com"]);
    assert.ok(options.headers["Idempotency-Key"]);
    return Response.json({ id: "mocked-delivery-id" });
  };
  assert.equal((await sendContactEmail(valid)).status, "success");
  globalThis.fetch = async () => Response.json({ error: "provider failure" }, { status: 503 });
  assert.equal((await sendContactEmail(valid)).status, "error");
  globalThis.fetch = async () => Response.json({});
  assert.equal((await sendContactEmail(valid)).status, "error");
  globalThis.fetch = async () => { throw new Error("connection lost"); };
  assert.equal((await sendContactEmail(valid)).status, "error");
  console.log("Contact validation and mocked delivery scenarios passed. No external network calls.");
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
}
