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
            <Eyebrow>{c("From Goma, North Kivu")}</Eyebrow>
            <h2>
              {c("Goma as")}{" "}<br />
              {c("I know it.")}</h2>
            <p className="beyond-lede">
              {c("Goma has its difficulties. It also has artists, businesses and people helping one another.")}</p>
            <div className="prose">
              <p>
                {c("I want to write about the people who make this city what it is.")}</p>
              <p>
                {c("I use interviews, photography and writing to show what happens here.")}</p>
            </div>
            <div className="beyond-meta">
              <span>
                {c("Lake Kivu")}<br />
                {c("By the lake")}</span>
              <span>
                {c("Goma")}<br />
                {c("My city")}</span>
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
              </figcaption>
            </figure>
            <div className="beyond-gallery-bottom">
              <EditorialImage
                src="/images/home/home-3.webp"
                alt={c("Art and cultural exchange at an exhibition in Goma")}
              />
              <EditorialImage
                src="/images/andrino/workshop.webp"
                alt={c("Andrino leading a session at Google I/O Extended in Goma")}
                className="andrino-workshop"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
