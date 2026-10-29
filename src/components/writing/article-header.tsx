import { useCopy } from "@/i18n/copy";
import { useLocale } from "next-intl";
import type { Article } from "@/types/article";
import { Eyebrow } from "@/components/shared/editorial";
export function ArticleHeader({ article }: { article: Article }) {
  const c = useCopy();
  const locale = useLocale();

  return (
    <header className="detail-header">
      <Eyebrow>
        {c(article.category)} /{" "}
        {c(article.status === "forthcoming" ? "Editorial focus" : "The journal")}
      </Eyebrow>
      <h1>{c(article.title)}</h1>
      <p>{c(article.excerpt)}</p>
      {article.publishedAt && (
        <time dateTime={article.publishedAt}>
          {new Intl.DateTimeFormat(locale, {
            dateStyle: "long",
            timeZone: "UTC",
          }).format(new Date(article.publishedAt))}
        </time>
      )}
    </header>
  );
}
