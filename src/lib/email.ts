import { createHash } from "node:crypto";
import type { ContactInput, ContactResult } from "@/types/contact";
export async function sendContactEmail(
  input: ContactInput,
): Promise<ContactResult> {
  const apiKey = process.env.RESEND_API_KEY,
    recipient = process.env.CONTACT_EMAIL,
    from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !recipient || !from)
    return {
      status: "error",
      message:
        "Message delivery is not available yet. Please use the direct email link or try again later. Your message has not been sent.",
    };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        "Idempotency-Key": createHash("sha256")
          .update(input.email + input.subject + input.message)
          .digest("hex"),
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: input.email,
        subject: "Andrino website · " + input.subject,
        text:
          "From: " +
          input.name +
          " <" +
          input.email +
          ">\nSubject: " +
          input.subject +
          "\n\n" +
          input.message,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok)
      return {
        status: "error",
        message:
          "Your message could not be sent. Please try again later or use the direct email link.",
      };
    const result = (await response.json()) as { id?: string };
    if (!result.id)
      return {
        status: "error",
        message: "Delivery could not be confirmed. Please try again later.",
      };
    return {
      status: "success",
      message:
        "Thank you. Your message has been sent. I look forward to continuing the conversation.",
    };
  } catch {
    return {
      status: "error",
      message:
        "The connection could not be completed. Please try again later. Your form is still here.",
    };
  }
}
