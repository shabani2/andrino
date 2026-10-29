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
        <SectionIntro label={c("Chapter 02")} title={c("My journey & field philosophy.")}>
          {c("Humanitarian communication, digital media, editorial storytelling and community-focused initiatives.")}</SectionIntro>
        <div className="journey-grid">
          <div>
            <Eyebrow>{c("02.1 / Trajectory")}</Eyebrow>
            <div className="prose prose-large">
              <p>{c(biography[0])}</p>
            </div>
            <div className="editorial-quote">
              <blockquote>
                {c("“Who gets to tell Africa’s stories, and what happens when we begin to tell them differently?”")}</blockquote>
              <cite>{c("A question at the heart of my work")}</cite>
            </div>
            <div className="prose">
              {biography.slice(1).map((paragraph) => (
                <p key={paragraph}>{c(paragraph)}</p>
              ))}
            </div>
          </div>
          <aside
            className="journey-aside"
            aria-label={c("Practice and perspectives")}
          >
            <div className="sidebar-panel">
              <DisciplineIcon name="book" />
              <h3 className="mt-4">{c("The editorial ethos.")}</h3>
              <p>
                {c("Making room for the full picture. Finding the words, images and perspectives that help people care, understand and engage.")}</p>
            </div>
            <figure>
              <EditorialImage
                src="/images/about/about-2.webp"
                alt={c("People exchanging ideas during a community gathering in the Great Lakes region")}
              />
              <figcaption className="image-caption">
                <span>{c("People, places and the conversations between them.")}</span>
              </figcaption>
            </figure>
            <div className="sidebar-panel">
              <Eyebrow>{c("Practices & disciplines")}</Eyebrow>
              <ul className="practice-list">
                {[
                  "Communication planning",
                  "Human-interest storytelling",
                  "Digital media & content",
                  "Photography & video",
                  "Editorial writing",
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
