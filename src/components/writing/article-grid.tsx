import type { Article } from "@/types/article";
import { ArticleCard } from "./article-card";
export function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="writing-grid">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}
