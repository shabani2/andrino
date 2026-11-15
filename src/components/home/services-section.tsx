import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import { SectionIntro } from "@/components/shared/editorial";
import { DisciplineIcon } from "@/components/shared/discipline-icon";
import { disciplines } from "@/content/editorial";
export function ServicesSection() {
  const c = useCopy();

  return (
    <section className="section-padding">
      <Container>
        <SectionIntro number="02" label={c("What I work on")} title={c("What I do.")}>
          {c("I work with text, images and campaigns to make a subject clear.")}</SectionIntro>
        <div className="discipline-grid">
          {disciplines.map((item, index) => (
            <article className="discipline-card" key={item.title}>
              <div className="discipline-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <DisciplineIcon name={item.icon} />
              </div>
              <h3>{c(item.title)}</h3>
              <p>{c(item.description)}</p>
              <div className="tag-list">
                {item.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {c(tag)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
