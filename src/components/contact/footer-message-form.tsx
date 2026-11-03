"use client";

import { ChevronDown, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ContactForm } from "./contact-form";

export function FooterMessageForm() {
  const t = useTranslations("contactChannels");
  const pathname = usePathname();

  // Keep a single form (and unique field IDs) when already on the Contact page.
  if (pathname === "/contact") {
    return <Link href="/contact#contact-form" className="footer-message-link"><Send size={18} aria-hidden="true" />{t("messageTitle")}</Link>;
  }

  return (
    <details className="footer-message">
      <summary className="footer-message-summary">
        <span className="footer-message-icon"><Mail size={23} strokeWidth={1.5} aria-hidden="true" /></span>
        <span><strong>{t("messageTitle")}</strong><span className="footer-message-description">{t("messageIntro")}</span></span>
        <ChevronDown size={20} className="footer-message-chevron" aria-hidden="true" />
      </summary>
      <div className="footer-message-body"><ContactForm /></div>
    </details>
  );
}
