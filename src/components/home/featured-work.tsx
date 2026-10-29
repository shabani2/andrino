import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/container";
import {
  EditorialImage,
  ArrowLink,
  SectionIntro,
} from "@/components/shared/editorial";
import { portfolioAreas } from "@/content/editorial";
export function FeaturedWork() {
  const c = useCopy();

  return (
    <section className="section-padding">
      <Container>
        <SectionIntro
          number="03"
          label={c("Work & practice")}
          title={c("Selected work.")}
          action={<ArrowLink href="/portfolio">{c("Explore my portfolio")}</ArrowLink>}
        />
        <div className="work-grid">
          {portfolioAreas.slice(0, 5).map((item, index) => (
            <article className="work-card" key={item.slug}>
              <Link href={"/portfolio/" + item.slug}>
                <EditorialImage
                  src={"/images/home/home-" + (index + 5) + ".webp"}
                  alt={c(item.alt)}
                  sizes={
                    index < 2
                      ? "(max-width: 767px) 100vw, 50vw"
                      : "(max-width: 767px) 100vw, 33vw"
                  }
                />
                <div className="card-meta">
                  <span>{c(item.category)}</span>
                  <span>0{index + 1}</span>
                </div>
                <h3>{c(item.title)}</h3>
              </Link>
              <p>{c(item.description)}</p>
              <ArrowLink href={"/portfolio/" + item.slug}>
                {c("Explore this practice")}</ArrowLink>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
