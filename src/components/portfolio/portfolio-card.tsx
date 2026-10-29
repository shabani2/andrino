import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import type { PortfolioItem } from "@/types/portfolio";
import { EditorialImage, ArrowLink } from "@/components/shared/editorial";
export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const c = useCopy();

  return (
    <article className="portfolio-card">
      <Link href={"/portfolio/" + item.slug} tabIndex={-1} aria-hidden="true">
        <EditorialImage src={item.image} alt={c(item.alt)} />
      </Link>
      <div className="portfolio-card-body">
        <div className="card-meta">
          <span>{c(item.category)}</span>
          <span>{c("Practice area")}</span>
        </div>
        <h2>
          <Link href={"/portfolio/" + item.slug}>{c(item.title)}</Link>
        </h2>
        <p>{c(item.description)}</p>
        <div className="card-bottom-row">
          <div className="tag-list">
            {item.tags.map((tag) => (
              <span className="tag" key={tag}>
                {c(tag)}
              </span>
            ))}
          </div>
          <ArrowLink href={"/portfolio/" + item.slug}>{c("View focus")}</ArrowLink>
        </div>
      </div>
    </article>
  );
}
