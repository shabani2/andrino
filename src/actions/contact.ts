"use server";
import { sendContactEmail } from "@/lib/email";
import { validateContact } from "@/lib/contact-validation";
import { privateSupabase } from "@/lib/supabase";
import type { ContactResult } from "@/types/contact";
import { getLocale } from "next-intl/server";
export async function submitContact(
  _previous: ContactResult,
  formData: FormData,
): Promise<ContactResult> {
  const read = (key: string) =>
    typeof formData.get(key) === "string"
      ? String(formData.get(key)).trim()
      : "";
  if (read("website"))
    return {
      status: "error",
      message: "Message not accepted. Try again.",
    };
  const input = {
    name: read("name"),
    email: read("email"),
    subject: read("subject"),
    message: read("message"),
    consent: read("consent") === "on",
  };
  const errors = validateContact(input);
  if (Object.keys(errors).length)
    return {
      status: "error",
      message: "Some fields need correction. Check the highlighted fields.",
      errors,
    };
  if (!process.env.SUPABASE_SECRET_KEY) return sendContactEmail(input);
  const requestedLocale = await getLocale();
  const locale = requestedLocale === "fr" ? "fr" : "en";
  try {
    const { error } = await privateSupabase().from("contact_messages").insert({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      consent_at: new Date().toISOString(),
      locale,
    });
    if (error) throw error;
  } catch {
    return { status: "error", message: "Message not saved. Try again later." };
  }
  await sendContactEmail(input);
  return { status: "success", message: "Message saved. I’ll reply by email." };
}
