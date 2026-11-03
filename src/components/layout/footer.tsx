import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { ArrowUp } from "lucide-react";
import { identity } from "@/config/identity";
import { SocialLinks } from "@/components/shared/social-links";
import { Container } from "./container";
import { useTranslations } from "next-intl";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { FooterMessageForm } from "@/components/contact/footer-message-form";
export function Footer() {
  const c = useCopy();
  const t = useTranslations("contactChannels");

  return (
    <footer className="site-footer">
      <Container>
        <FooterMessageForm />
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark footer-wordmark">
              {c("ANDRINO")}</Link>
            <p className="footer-tagline">{c(identity.tagline)}</p>
            <p className="footer-description">
              {c("Communications · Storytelling · Writing · Ideas")}<br />
              {c("Goma, Democratic Republic of the Congo.")}</p>
            <div className="footer-contact">
              <a href={"mailto:" + identity.email}><PlatformIcon name="Direct email" />{identity.email}</a>
              <a href={"tel:" + identity.phone}><PlatformIcon name="Phone" />{identity.phoneDisplay}</a>
              <a href={identity.whatsapp} target="_blank" rel="noopener noreferrer"><PlatformIcon name="WhatsApp" />{t("whatsapp")}<span className="sr-only"> {c("(opens in a new tab)")}</span></a>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-social">
              <p className="eyebrow">{t("socialTitle")}</p>
              <SocialLinks />
            </div>
            <a href="#top" className="text-link small">
              <ArrowUp size={14} aria-hidden="true" />
              {c("Back to top")}
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {c("Andrino. All rights reserved.")}</p>
          <p>
            {c("The views expressed in my personal writing are my own unless otherwise stated.")}</p>
        </div>
      </Container>
    </footer>
  );
}
