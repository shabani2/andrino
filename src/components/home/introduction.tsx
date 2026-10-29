import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/shared/editorial";
import { conviction } from "@/content/editorial";
export function Introduction() {
  const c = useCopy();

  return (
    <section className="section-padding surface-muted">
      <Container>
        <div className="prologue-grid">
          <div>
            <Eyebrow>{c("01 / Prologue")}</Eyebrow>
            <h2>{c("Stories, perspectives and possibilities.")}</h2>
            <div className="rule-accent" />
            <p className="prologue-intro">
              {c("Exploring the people, ideas and everyday realities shaping Africa, from the heart of the Great Lakes region.")}</p>
          </div>
          <div>
            <div className="prose prose-large">
              <p>
                {c("My work sits at the intersection of communication, media, storytelling and community-driven initiatives. Through writing, digital content, campaigns and multimedia, I explore how stories can help people understand one another, discover new perspectives and see possibilities beyond the headlines.")}</p>
              <p>
                {c("Based in Goma, in the eastern Democratic Republic of the Congo, I am particularly interested in the stories that often go untold: the people building businesses, creating art, developing local solutions and imagining different futures for their communities.")}</p>
            </div>
            <div className="editorial-quote">
              <span className="quote-label">{c("Editorial conviction")}</span>
              <blockquote>“{c(conviction)}”</blockquote>
              <cite>{c("Andrino Akuda Kangela")}</cite>
            </div>
            <div className="insight-strip">
              <div>
                <strong>{c("Communication")}</strong>
                <span>{c("Ideas made clear. Messages that connect.")}</span>
              </div>
              <div>
                <strong>{c("Storytelling")}</strong>
                <span>{c("Human experiences beyond the statistics.")}</span>
              </div>
              <div>
                <strong>{c("Goma based")}</strong>
                <span>{c("Local perspectives. Wider conversations.")}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
