"use client";
import { useCopy } from "@/i18n/copy";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import type { Article } from "@/types/article";
import { ArticleGrid } from "./article-grid";
export function WritingExplorer({ articles }: { articles: Article[] }) {
  const c = useCopy();

  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categories = [
    "All themes",
    ...new Set(articles.map((article) => article.category)),
  ];
  const selected = categories.includes(search.get("category") || "")
    ? search.get("category")!
    : "All themes";
  const visible =
    selected === "All themes"
      ? articles
      : articles.filter((article) => article.category === selected);
  function select(category: string) {
    const query = new URLSearchParams(search.toString());
    if (category === "All themes") query.delete("category");
    else query.set("category", category);
    router.replace(pathname + (query.size ? "?" + query.toString() : ""), {
      scroll: false,
    });
  }
  return (
    <>
      <div className="filter-region">
        <div className="filter-label">
          <Filter size={14} aria-hidden="true" />
          {c("Browse by curated theme")}</div>
        <div
          className="filter-list"
          role="group"
          aria-label={c("Filter writing themes")}
        >
          {categories.map((category) => (
            <button
              type="button"
              className="filter-button"
              aria-pressed={category === selected}
              key={category}
              onClick={() => select(category)}
            >
              {c(category)}
            </button>
          ))}
        </div>
        <p role="status" className="result-count">
          {c(visible.length)} {c(visible.length === 1 ? "theme" : "themes")} ·{" "}
          {c(selected)}
        </p>
      </div>
      <ArticleGrid articles={visible} />
    </>
  );
}
