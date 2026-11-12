import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !publishable || !secret) {
  throw new Error("Set Supabase environment variables before running this check");
}

const options = { auth: { persistSession: false, autoRefreshToken: false } };
const publicClient = createClient(url, publishable, options);
const adminClient = createClient(url, secret, options);
const slug = `security-probe-${Date.now()}`;
let entryId;
let messageId;
try {
  const inserted = await adminClient.from("entries")
    .insert({ kind: "article", slug })
    .select("id").single();
  if (inserted.error) throw inserted.error;
  entryId = inserted.data.id;

  const draft = await adminClient.from("entry_translations").insert({
    entry_id: entryId, locale: "en", title: "Security probe", state: "draft",
  });
  if (draft.error) throw draft.error;

  const hiddenEntry = await publicClient.from("entries").select("id").eq("id", entryId);
  if (hiddenEntry.error) throw hiddenEntry.error;
  assert.equal(hiddenEntry.data.length, 0, "Draft entry leaked through public RLS");

  const hiddenTranslation = await publicClient.from("entry_translations")
    .select("entry_id").eq("entry_id", entryId);
  if (hiddenTranslation.error) throw hiddenTranslation.error;
  assert.equal(hiddenTranslation.data.length, 0, "Draft translation leaked through public RLS");

  const publicWrite = await publicClient.from("entries")
    .insert({ kind: "article", slug: `${slug}-write` });
  assert.ok(publicWrite.error, "Anonymous content write was accepted");

  const contact = {
    name: "Security probe",
    email: `${slug}@example.invalid`,
    subject: "Security check",
    message: "Disposable access-control check.",
    consent_at: new Date().toISOString(),
    locale: "en",
  };
  const publicContactWrite = await publicClient.from("contact_messages").insert(contact);
  assert.ok(publicContactWrite.error, "Anonymous contact write was accepted");
  const savedContact = await adminClient.from("contact_messages")
    .insert(contact).select("id").single();
  if (savedContact.error) throw savedContact.error;
  messageId = savedContact.data.id;

  const publicContent = await publicClient.from("entries")
    .select("id, entry_translations!inner(locale, state)")
    .eq("entry_translations.locale", "fr")
    .eq("entry_translations.state", "published");
  if (publicContent.error) throw publicContent.error;
  assert.equal(publicContent.data.length, 15);
  console.log("Supabase content, contact and draft access checks passed.");
} finally {
  if (entryId) {
    const removed = await adminClient.from("entries").delete().eq("id", entryId);
    if (removed.error) throw removed.error;
  }
  if (messageId) {
    const removed = await adminClient.from("contact_messages").delete().eq("id", messageId);
    if (removed.error) throw removed.error;
  }
  await adminClient.from("entries").delete().eq("slug", `${slug}-write`);
  await adminClient.from("contact_messages").delete().eq("email", `${slug}@example.invalid`);
}
