import { useCopy } from "@/i18n/copy";
import { Mail, MapPin, Clock3, Languages, Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/container";
import { Eyebrow, ActionLink } from "@/components/shared/editorial";
import { identity } from "@/config/identity";
export function ConnectSection() {
  const c = useCopy();
  const t = useTranslations("contactChannels");

  return (
    <section className="section-padding">
      <Container>
        <div className="connect-grid">
          <div>
            <Eyebrow>{c("05 / Contact")}</Eyebrow>
            <h2>{c("Let’s connect.")}</h2>
            <p className="prose">
              {c("Tell me about an article, a project or a question.")}</p>
            <ActionLink href="/contact">{c("Get in touch")}</ActionLink>
          </div>
          <div className="connect-info">
            <div className="info-line">
              <Mail size={20} aria-hidden="true" />
              <a href={"mailto:" + identity.email}>
                <strong>{c("Direct email")}</strong>
                {c(identity.email)}
              </a>
            </div>
            <div className="info-line">
              <Phone size={20} aria-hidden="true" />
              <a href={"tel:" + identity.phone}><strong>{t("phone")}</strong>{identity.phoneDisplay}</a>
            </div>
            <div className="info-line">
              <MessageCircle size={20} aria-hidden="true" />
              <a href={identity.whatsapp} target="_blank" rel="noopener noreferrer"><strong>WhatsApp</strong>{t("whatsapp")}<span className="sr-only"> {c("(opens in a new tab)")}</span></a>
            </div>
            <div className="info-line">
              <MapPin size={20} aria-hidden="true" />
              <div>
                <strong>{c("Goma, DR Congo")}</strong>{c("Based in Goma.")}</div>
            </div>
            <div className="info-line">
              <Clock3 size={20} aria-hidden="true" />
              <div>
                <strong>{c("Central Africa Time")}</strong>{c("CAT · UTC+2")}</div>
            </div>
            <div className="info-line">
              <Languages size={20} aria-hidden="true" />
              <div>
                <strong>{c("French · English · Swahili")}</strong>{c("I can speak in three languages.")}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
