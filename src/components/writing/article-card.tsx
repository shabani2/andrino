import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/types/article";
import { EditorialImage, ArrowLink } from "@/components/shared/editorial";
export function ArticleCard({ article }: { article: Article }) {
  const c = useCopy();

  return (
    <article className="article-card">
      <Link href={"/writing/" + article.slug} tabIndex={-1} aria-hidden="true">
        <EditorialImage
          src={article.coverImage}
          alt={c(article.alt)}
          sizes="(max-width: 767px) 100vw, 33vw"
        />
      </Link>
      <div className="card-meta">
        <span>{c(article.category)}</span>
        <span>
          {c(article.status === "forthcoming" ? "Editorial focus" : "Published")}
        </span>
      </div>
      <h3>
        <Link href={"/writing/" + article.slug}>{c(article.title)}</Link>
      </h3>
      <p className="card-description">{c(article.excerpt)}</p>
      <div className="tag-list">
        {article.tags.map((tag) => (
          <span className="tag" key={tag}>
            #{c(tag).replaceAll(" ", "")}
          </span>
        ))}
      </div>
      <div className="article-card-bottom">
        <span>
          {c(article.status === "forthcoming"
            ? "Forthcoming writing"
            : article.publishedAt)}
        </span>
        <ArrowLink href={"/writing/" + article.slug}>
          {c(article.status === "forthcoming" ? "Explore" : "Read")}
        </ArrowLink>
      </div>
    </article>
  );
}
