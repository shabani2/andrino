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
        <SectionIntro label={c("My principles")} title={c("What guides my work.")}>
          {c("I use these principles when I write, plan and work with others.")}</SectionIntro>
        <div className="beliefs-grid">
          {beliefs.map((belief, index) => (
            <article className="belief-card" key={belief.title}>
              <div className="discipline-top">
                <span>0{index + 1}</span>
                <DisciplineIcon name={belief.icon} />
              </div>
              <h3>{c(belief.title)}</h3>
              <p>{c(belief.body)}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
