import type { ContactInput, ContactErrors } from "@/types/contact";
export const contactSubjects = [
  "Article or story idea",
  "Communications project",
  "Community or humanitarian project",
  "Creative project",
  "Speaking invitation",
  "Another question",
] as const;
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.trim().length < 2 || input.name.trim().length > 200)
    errors.name = "Name missing or too long. Enter 2–200 characters.";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ||
    input.email.length > 254
  )
    errors.email = "Email address invalid. Enter a complete address.";
  if (
    !contactSubjects.includes(input.subject as (typeof contactSubjects)[number])
  )
    errors.subject = "Subject missing. Choose a subject.";
  if (input.message.trim().length < 20 || input.message.trim().length > 2500)
    errors.message = "Message too short or too long. Write between 20 and 2,500 characters.";
  if (!input.consent)
    errors.consent = "Reply agreement missing. Tick the box to receive a reply.";
  return errors;
}
