"use server";
import { sendContactEmail } from "@/lib/email";
import { validateContact } from "@/lib/contact-validation";
import type { ContactResult } from "@/types/contact";
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
      message: "This message could not be accepted. Please try again.",
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
      message: "Please check the highlighted fields before sending.",
      errors,
    };
  return sendContactEmail(input);
}
