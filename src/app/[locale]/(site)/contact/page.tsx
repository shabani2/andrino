import { useCopy } from "@/i18n/copy";
import { Info, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/shared/editorial";
import { ContactChannels, ContactInformation } from "@/components/contact/contact-information";
import { ContactForm } from "@/components/contact/contact-form";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Contact",
  "Contact Andrino about an article, a communications project or an invitation.",
  "/contact",
); }
export default function ContactPage() {
  const c = useCopy();

  return (
    <>
      <section className="page-hero contact-hero section-padding">
        <Container>
          <Eyebrow>{c("Let’s connect")}</Eyebrow>
          <div className="contact-hero-grid">
            <div>
              <h1>
                {c("Let’s start a")}{" "}<em>{c("conversation")}</em>.
              </h1>
              <p className="page-hero-description">
                {c("You can write to me about an article, a communications project or an invitation to speak. Tell me what you have in mind.")}</p>
            </div>
            <div className="page-note">
              <Info
                size={17}
                className="mb-3 text-secondary"
                aria-hidden="true"
              />
              {c("Use the form below or write to me on LinkedIn.")}</div>
          </div>
        </Container>
      </section>
      <section className="section-padding surface-white">
        <Container>
          <div className="contact-columns">
            <ContactInformation />
            <ContactForm />
            <ContactChannels />
          </div>
        </Container>
      </section>
      <section className="discretion">
        <Container>
          <ShieldCheck size={30} strokeWidth={1.4} aria-hidden="true" />
          <div>
            <h2>{c("Share only what is needed.")}</h2>
            <p>
              {c("Send only the details needed to start. Avoid naming people in sensitive situations here.")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
