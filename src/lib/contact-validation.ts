import type { ContactInput, ContactErrors } from "@/types/contact";
export const contactSubjects = [
  "Editorial enquiry or story pitch",
  "Strategic communications",
  "Humanitarian and development storytelling",
  "Creative collaboration",
  "Speaking or other opportunity",
  "An idea worth sharing",
] as const;
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  if (input.name.trim().length < 2 || input.name.trim().length > 200)
    errors.name = "Please enter your name (2–200 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ||
    input.email.length > 254
  )
    errors.email = "Please enter a valid email address.";
  if (
    !contactSubjects.includes(input.subject as (typeof contactSubjects)[number])
  )
    errors.subject = "Please select the subject of your message.";
  if (input.message.trim().length < 20 || input.message.trim().length > 2500)
    errors.message = "Please write a message between 20 and 2,500 characters.";
  if (!input.consent)
    errors.consent = "Please confirm that I may reply to your message.";
  return errors;
}
