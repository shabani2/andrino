import { useCopy } from "@/i18n/copy";
import { Container } from "@/components/layout/container";
import { EditorialImage, Eyebrow } from "@/components/shared/editorial";
export function BeyondHeadlines() {
  const c = useCopy();

  return (
    <section className="section-padding beyond-section">
      <Container>
        <div className="beyond-grid">
          <div>
            <Eyebrow>{c("Dispatch from Goma / North Kivu")}</Eyebrow>
            <h2>
              {c("Beyond the")}<br />
              {c("headlines.")}</h2>
            <p className="beyond-lede">
              {c("Africa is more than the stories most frequently told about it. Goma is more than the headlines that define it.")}</p>
            <div className="prose">
              <p>
                {c("I want to explore the people, creativity, businesses, cultures and ideas that make our communities what they are.")}</p>
              <p>
                {c("My work is an ongoing attempt to document these realities, ask better questions and contribute to a richer understanding of the places we call home.")}</p>
            </div>
            <div className="beyond-meta">
              <span>
                {c("Lake Kivu")}<br />
                {c("Living waters")}</span>
              <span>
                {c("Goma")}<br />
                {c("Creative possibilities")}</span>
              <span>
                {c("Great Lakes")}<br />
                {c("Local perspectives")}</span>
            </div>
          </div>
          <div className="beyond-gallery">
            <figure>
              <EditorialImage
                src="/images/home/home-2.webp"
                alt={c("A quiet lakeside gathering on the shores of Lake Kivu")}
              />
              <figcaption className="image-caption">
                <span>{c("On the shores of Lake Kivu, Goma.")}</span>
                <span>{c("FIELD NOTES")}</span>
              </figcaption>
            </figure>
            <div className="beyond-gallery-bottom">
              <EditorialImage
                src="/images/home/home-3.webp"
                alt={c("Art and cultural exchange at an exhibition in Goma")}
              />
              <EditorialImage
                src="/images/home/home-4.webp"
                alt={c("Young creatives exchanging ideas in a shared workspace")}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
