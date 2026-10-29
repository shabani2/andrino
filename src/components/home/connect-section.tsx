import { useCopy } from "@/i18n/copy";
import { Mail, MapPin, Clock3, Languages } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow, ActionLink } from "@/components/shared/editorial";
import { identity } from "@/config/identity";
export function ConnectSection() {
  const c = useCopy();

  return (
    <section className="section-padding">
      <Container>
        <div className="connect-grid">
          <div>
            <Eyebrow>{c("05 / Collaboration")}</Eyebrow>
            <h2>{c("Let’s connect.")}</h2>
            <p className="prose">
              {c("Whether you are an editor, communications professional, fellow storyteller, organisation or someone with an interesting idea, I welcome conversations that can lead to meaningful work.")}</p>
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
              <MapPin size={20} aria-hidden="true" />
              <div>
                <strong>{c("Goma, DR Congo")}</strong>{c("Grounded in the Great Lakes region.")}</div>
            </div>
            <div className="info-line">
              <Clock3 size={20} aria-hidden="true" />
              <div>
                <strong>{c("Central Africa Time")}</strong>{c("CAT · UTC+2")}</div>
            </div>
            <div className="info-line">
              <Languages size={20} aria-hidden="true" />
              <div>
                <strong>{c("French · English · Swahili")}</strong>{c("Conversations across perspectives.")}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
