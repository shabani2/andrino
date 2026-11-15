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
            <Eyebrow>{c("01 / From Goma")}</Eyebrow>
            <h2>{c("Stories from Goma and the Great Lakes.")}</h2>
            <div className="rule-accent" />
            <p className="prologue-intro">
              {c("I write about people and everyday life in the Great Lakes region.")}</p>
          </div>
          <div>
            <div className="prose prose-large">
              <p>
                {c("I write articles and make content for projects and campaigns. I also use photography and video to tell those stories.")}</p>
              <p>
                {c("In Goma, I pay attention to people starting businesses, making art and helping neighbours. Their stories need time and context.")}</p>
            </div>
            <div className="editorial-quote">
              <span className="quote-label">{c("My point of view")}</span>
              <blockquote>“{c(conviction)}”</blockquote>
              <cite>{c("Andrino Akuda Kangela")}</cite>
            </div>
            <div className="insight-strip">
              <div>
                <strong>{c("Communication")}</strong>
                <span>{c("Clear words for the people concerned.")}</span>
              </div>
              <div>
                <strong>{c("Storytelling")}</strong>
                <span>{c("The people behind the figures.")}</span>
              </div>
              <div>
                <strong>{c("In Goma")}</strong>
                <span>{c("A view from Goma.")}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
