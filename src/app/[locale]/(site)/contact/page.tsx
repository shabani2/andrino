import { useCopy } from "@/i18n/copy";
import { Info, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/shared/editorial";
import { ContactInformation } from "@/components/contact/contact-information";
import { ContactForm } from "@/components/contact/contact-form";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Contact",
  "Start a conversation about editorial enquiries, communications, creative projects or an idea worth sharing.",
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
                {c("I am always interested in connecting with people who care about stories, ideas, communication and the possibilities of creative collaboration. If you are an editor looking to discuss a story, a communications professional interested in working together, an organisation exploring a project, or simply someone with an idea worth sharing, I would be glad to hear from you.")}</p>
            </div>
            <div className="page-note">
              <Info
                size={17}
                className="mb-3 text-secondary"
                aria-hidden="true"
              />
              {c("For editorial enquiries, professional opportunities, collaborations and other conversations, use the contact form or connect with me on LinkedIn.")}</div>
          </div>
        </Container>
      </section>
      <section className="section-padding surface-white">
        <Container>
          <div className="contact-columns">
            <ContactInformation />
            <ContactForm />
          </div>
        </Container>
      </section>
      <section className="discretion">
        <Container>
          <ShieldCheck size={30} strokeWidth={1.4} aria-hidden="true" />
          <div>
            <h2>{c("Professional discretion & thoughtful communication.")}</h2>
            <p>
              {c("Every story starts with listening. Please share only the details needed to start our conversation, especially when discussing people or sensitive contexts.")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
