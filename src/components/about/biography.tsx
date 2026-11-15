import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import {
  EditorialImage,
  Eyebrow,
  SectionIntro,
} from "@/components/shared/editorial";
import { DisciplineIcon } from "@/components/shared/discipline-icon";
import { biography } from "@/content/editorial";
export function Biography() {
  const c = useCopy();

  return (
    <section className="section-padding surface-white">
      <Container>
        <SectionIntro label={c("My path")} title={c("My path to this work.")}>
          {c("Communications, articles, photos and video from Goma.")}</SectionIntro>
        <div className="journey-grid">
          <div>
            <Eyebrow>{c("02.1 / My path")}</Eyebrow>
            <div className="prose prose-large">
              <p>{c(biography[0])}</p>
            </div>
            <div className="editorial-quote">
              <blockquote>
                {c("“Who gets to tell Africa’s stories, and what happens when we begin to tell them differently?”")}</blockquote>
              <cite>{c("A question I return to")}</cite>
            </div>
            <div className="prose">
              {biography.slice(1).map((paragraph) => (
                <p key={paragraph}>{c(paragraph)}</p>
              ))}
            </div>
          </div>
          <aside
            className="journey-aside"
            aria-label={c("About my work")}
          >
            <div className="sidebar-panel">
              <DisciplineIcon name="book" />
              <h3 className="mt-4">{c("How I write.")}</h3>
              <p>
                {c("I listen first, then check the facts and choose the right format.")}</p>
            </div>
            <figure>
              <EditorialImage
                src="/images/andrino/speaking.webp"
                alt={c("Andrino speaking to participants at Google I/O Extended in Goma")}
              />
              <figcaption className="image-caption">
                <span>{c("Sharing ideas at Google I/O Extended, Goma.")}</span>
              </figcaption>
            </figure>
            <div className="sidebar-panel">
              <Eyebrow>{c("What I do")}</Eyebrow>
              <ul className="practice-list">
                {[
                  "Communication planning",
                  "Human-interest storytelling",
                  "Digital media & content",
                  "Photography & video",
                  "Writing articles",
                ].map((practice, index) => (
                  <li key={practice}>
                    {c(practice)}
                    <span>0{index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
