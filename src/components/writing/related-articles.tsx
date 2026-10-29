import type { Article } from "@/types/article";
import { ArticleGrid } from "./article-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { useCopy } from "@/i18n/copy";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  const c = useCopy();
  if (!articles.length) return null;
  return (
    <section className="py-8">
      <SectionHeading title={c("Other perspectives.")} />
      <ArticleGrid articles={articles} />
    </section>
  );
}
