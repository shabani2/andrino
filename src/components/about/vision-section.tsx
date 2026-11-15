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
            <Eyebrow>{c("What comes next")}</Eyebrow>
            <h2>
              {c("What I want to")}{" "}<br />
              {c("build next.")}</h2>
            <div className="prose">
              <p>
                {c("I want to keep writing and contribute to media that gives African voices room.")}</p>
              <p>
                {c("I want to support local projects and explain their work beyond Goma.")}</p>
              <p>
                {c("I want to keep asking questions and checking what I think I know.")}</p>
            </div>
            <div className="actions-row">
              <ActionLink href="/portfolio" variant="peach">
                {c("View my work")}</ActionLink>
              <ArrowLink href="/contact">
                {c("Get in touch")}</ArrowLink>
            </div>
          </div>
          <div className="manifesto">
            <Eyebrow>{c("My point of view")}</Eyebrow>
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
