import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import {
  EditorialImage,
  SectionIntro,
  ArrowLink,
} from "@/components/shared/editorial";
import { writingThemes } from "@/content/editorial";
export function LatestWriting() {
  const c = useCopy();

  return (
    <section className="section-padding surface-muted">
      <Container>
        <SectionIntro
          number="04"
          label={c("Dispatches & essays")}
          title={c("Latest writing.")}
          action={<ArrowLink href="/writing">{c("Read all articles")}</ArrowLink>}
        />
        <p className="prose mb-9 max-w-3xl">
          {c("A space for articles, personal essays, opinions and reflections. The first publications are taking shape around these themes.")}</p>
        <div className="writing-grid">
          {[writingThemes[0], writingThemes[3], writingThemes[1]].map(
            (item, index) => (
              <article className="article-card" key={item.slug}>
                <Link href={"/writing/" + item.slug}>
                  <EditorialImage
                    src={"/images/home/home-" + (index + 10) + ".webp"}
                    alt={c(item.alt)}
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <div className="card-meta">
                    <span>{c(item.category)}</span>
                    <span>{c("Editorial focus")}</span>
                  </div>
                  <h3>{c(item.title)}</h3>
                </Link>
                <p className="card-description">{c(item.description)}</p>
                <div className="article-card-bottom">
                  <span>{c("Forthcoming writing")}</span>
                  <ArrowLink href={"/writing/" + item.slug}>{c("Explore")}</ArrowLink>
                </div>
              </article>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}
