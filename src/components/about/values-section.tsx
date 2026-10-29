import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import { SectionIntro } from "@/components/shared/editorial";
import { DisciplineIcon } from "@/components/shared/discipline-icon";
import { beliefs } from "@/content/editorial";
export function ValuesSection() {
  const c = useCopy();

  return (
    <section className="section-padding">
      <Container>
        <SectionIntro label={c("Guiding principles")} title={c("What I believe in.")}>
          {c("Five convictions that shape the way I approach stories, communication and collaboration.")}</SectionIntro>
        <div className="beliefs-grid">
          {beliefs.map((belief, index) => (
            <article className="belief-card" key={belief.title}>
              <div className="discipline-top">
                <span>0{index + 1}</span>
                <DisciplineIcon name={belief.icon} />
              </div>
              <h3>{c(belief.title)}</h3>
              <p>{c(belief.body)}</p>
              <span className="tag">{c("Core tenet ·")}{" "}{c(belief.tenet)}</span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
