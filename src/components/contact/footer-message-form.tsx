"use client";

import { Mail, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ContactForm } from "./contact-form";

export function FooterMessageForm() {
  const t = useTranslations("contactChannels");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (!open) {
      if (hasOpened.current) trigger.current?.focus();
      return;
    }
    hasOpened.current = true;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    closeButton.current?.focus();
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button ref={trigger} type="button" className="footer-message" onClick={() => setOpen(true)}>
        <span className="footer-message-icon"><Mail size={23} strokeWidth={1.5} aria-hidden="true" /></span>
        <span><strong>{t("messageTitle")}</strong><span className="footer-message-description">{t("messageIntro")}</span></span>
        <Send size={20} className="footer-message-send" aria-hidden="true" />
      </button>
      {open && (
        <div className="contact-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="contact-modal" role="dialog" aria-modal="true" aria-label={t("messageTitle")}>
            <button ref={closeButton} type="button" className="contact-modal-close" onClick={close}
              aria-label={locale === "fr" ? "Fermer" : "Close"}>
              <X size={20} aria-hidden="true" />
            </button>
            <ContactForm idPrefix="footer-contact" />
          </section>
        </div>
      )}
    </>
  );
}
