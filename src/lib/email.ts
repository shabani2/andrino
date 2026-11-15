import nodemailer from "nodemailer";
import type { ContactInput, ContactResult } from "@/types/contact";
export async function sendContactEmail(
  input: ContactInput,
): Promise<ContactResult> {
  const recipient = process.env.CONTACT_EMAIL || "andrino243@gmail.com";
  const user = process.env.GMAIL_USER || "andrino243@gmail.com";
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password)
    return {
      status: "error",
      message:
        "Message not sent. Use the email link or try again later.",
    };
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: password },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
      disableFileAccess: true,
      disableUrlAccess: true,
      logger: false,
      debug: false,
    });
    const result = await transporter.sendMail({
      // The visitor never controls the sender or recipient.
      from: { name: "Andrino · Site web", address: user },
      to: recipient,
      replyTo: { name: input.name, address: input.email },
      subject: "Andrino · " + input.subject,
      text: [
        "Nouveau message depuis le site Andrino / New website message",
        "",
        "Nom / Name: " + input.name,
        "E-mail: " + input.email,
        "Objet / Subject: " + input.subject,
        "",
        input.message,
      ].join("\n"),
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const accepted = result.accepted.some((address) =>
      address.toLowerCase() === recipient.toLowerCase(),
    );
    if (!accepted || result.rejected.length)
      return {
        status: "error",
        message:
          "Message not sent. Try again later or use the email link.",
      };
    if (!result.messageId)
      return {
        status: "error",
        message: "Delivery not confirmed. Try again later.",
      };
    return {
      status: "success",
      message:
        "Message sent. I’ll reply by email.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Connection failed. Try again later; your text is still here.",
    };
  }
}
