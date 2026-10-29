import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import { ActionLink, ArrowLink, Eyebrow } from "@/components/shared/editorial";
import { conviction } from "@/content/editorial";
export function VisionSection() {
  const c = useCopy();

  return (
    <section className="section-padding vision-section">
      <Container>
        <div className="vision-grid">
          <div>
            <Eyebrow>{c("Horizon & vision")}</Eyebrow>
            <h2>
              {c("What I am")}<br />
              {c("working towards.")}</h2>
            <div className="prose">
              <p>
                {c("I want to keep growing as a communications professional, develop my voice as a writer and contribute to media that takes African perspectives seriously.")}</p>
              <p>
                {c("I am interested in building platforms, supporting meaningful initiatives and producing work that connects local experiences with wider conversations.")}</p>
              <p>
                {c("Most importantly, I want to remain curious: about people, places, ideas and the possibilities that emerge when we look beyond what we think we already know.")}</p>
            </div>
            <div className="actions-row">
              <ActionLink href="/portfolio" variant="peach">
                {c("Explore selected work")}</ActionLink>
              <ArrowLink href="/contact" className="text-white">
                {c("Get in touch")}</ArrowLink>
            </div>
          </div>
          <div className="manifesto">
            <Eyebrow>{c("Editorial conviction")}</Eyebrow>
            <blockquote>“{c(conviction)}”</blockquote>
            <cite>
              {c("ANDRINO AKUDA KANGELA")}<br />
              {c("Writer & storyteller · Goma, DRC")}</cite>
          </div>
        </div>
      </Container>
    </section>
  );
}
