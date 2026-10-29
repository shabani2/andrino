"use client";
import { useCopy } from "@/i18n/copy";
import { useLocale } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import { submitContact } from "@/actions/contact";
import { contactSubjects } from "@/lib/contact-validation";
import type { ContactInput, ContactResult } from "@/types/contact";
const initial: ContactResult = { status: "idle", message: "" };
export function ContactForm() {
  const c = useCopy();
  const locale = useLocale();

  const [state, action, pending] = useActionState(submitContact, initial);
  const [fields, setFields] = useState<ContactInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status !== "idle") feedback.current?.focus();
  }, [state]);
  const errors = state.errors || {};
  function update<K extends keyof ContactInput>(
    key: K,
    value: ContactInput[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
  }
  return (
    <section className="contact-form-panel" aria-labelledby="inquiry-title">
      <div className="contact-form-top">
        <div>
          <p className="eyebrow">{c("Editorial contact")}</p>
          <h2 id="inquiry-title">{c("Let’s hear your idea.")}</h2>
          <p>
            {c("For editorial enquiries, professional opportunities, collaborations and other conversations.")}</p>
        </div>
        <span className="status-badge">
          <Mail size={12} aria-hidden="true" />
          {c("Open to conversations")}</span>
      </div>
      <form action={action} className="contact-form" noValidate>
        {state.status !== "idle" && (
          <div
            ref={feedback}
            tabIndex={-1}
            role={state.status === "error" ? "alert" : "status"}
            className={
              "form-feedback " + (state.status === "error" ? "error" : "")
            }
          >
            {state.status === "success" && (
              <CheckCircle2
                size={18}
                className="inline mr-2"
                aria-hidden="true"
              />
            )}
            {c(state.message)}
            {Object.keys(errors).length > 0 && (
              <ul>
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    <a href={"#contact-" + field}>{c(error)}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <fieldset disabled={pending} className="contents">
          <legend className="sr-only">{c("Your message to Andrino")}</legend>
          <div className="form-row">
            <div className="field">
              <label htmlFor="contact-name">{c("Full name *")}</label>
              <input
                id="contact-name"
                name="name"
                autoComplete="name"
                placeholder={c("Your full name")}
                maxLength={200}
                required
                value={fields.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p className="field-error" id="name-error">
                  {c(errors.name)}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="contact-email">{c("Email address *")}</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={c("you@example.com")}
                maxLength={254}
                required
                value={fields.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p className="field-error" id="email-error">
                  {c(errors.email)}
                </p>
              )}
            </div>
          </div>
          <div className="field">
            <label htmlFor="contact-subject">
              {c("Subject / Nature of enquiry *")}</label>
            <select
              id="contact-subject"
              name="subject"
              value={fields.subject}
              onChange={(event) => update("subject", event.target.value)}
              required
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            >
              <option value="">{c("Select the purpose of your note")}</option>
              {contactSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {c(subject)}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="field-error" id="subject-error">
                {c(errors.subject)}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="contact-message">{c("Your message *")}</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder={c("Tell me about your idea, story or project…")}
              maxLength={2500}
              required
              value={fields.message}
              onChange={(event) => update("message", event.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={
                "message-count" + (errors.message ? " message-error" : "")
              }
            />
            <p className="character-count" id="message-count">
              {fields.message.length.toLocaleString(locale)} / {(2500).toLocaleString(locale)}
            </p>
            {errors.message && (
              <p className="field-error" id="message-error">
                {c(errors.message)}
              </p>
            )}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="contact-website">{c("Leave this field empty")}</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="checkbox-field">
              <input
                id="contact-consent"
                name="consent"
                type="checkbox"
                checked={fields.consent}
                onChange={(event) => update("consent", event.target.checked)}
                required
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <span>
                {c("I agree to be contacted in response to this enquiry. My details will only be used to continue this conversation.")}</span>
            </label>
            {errors.consent && (
              <p className="field-error mt-2" id="consent-error">
                {c(errors.consent)}
              </p>
            )}
          </div>
          <button type="submit" className="form-submit" disabled={pending}>
            {c(pending ? (
              <>
                <LoaderCircle
                  className="animate-spin"
                  size={18}
                  aria-hidden="true"
                />
                {c("Sending your message…")}</>
            ) : (
              <>
                {c("Send a message")}<ArrowRight size={18} aria-hidden="true" />
              </>
            ))}
          </button>
        </fieldset>
        <p className="form-hint">{c("Your words deserve a thoughtful response.")}</p>
      </form>
    </section>
  );
}
