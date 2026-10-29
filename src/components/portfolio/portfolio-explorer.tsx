"use client";
import { useCopy } from "@/i18n/copy";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type { PortfolioItem } from "@/types/portfolio";
import { PortfolioGrid } from "./portfolio-grid";
import { Filter } from "lucide-react";
export function PortfolioExplorer({ items }: { items: PortfolioItem[] }) {
  const c = useCopy();

  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categories = [
    "All work",
    ...new Set(items.map((item) => item.category)),
  ];
  const selected = categories.includes(search.get("category") || "")
    ? search.get("category")!
    : "All work";
  const visible =
    selected === "All work"
      ? items
      : items.filter((item) => item.category === selected);
  function select(category: string) {
    const query = new URLSearchParams(search.toString());
    if (category === "All work") query.delete("category");
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
          {c("Browse by practice")}</div>
        <div className="filter-list" role="group" aria-label={c("Filter portfolio")}>
          {categories.map((category) => (
            <button
              className="filter-button"
              type="button"
              key={category}
              aria-pressed={category === selected}
              onClick={() => select(category)}
            >
              {c(category)}
              {c(category === "All work" ? " (" + items.length + ")" : "")}
            </button>
          ))}
        </div>
        <p className="result-count" role="status">
          {c(visible.length)}{" "}
          {c(visible.length === 1 ? "practice area" : "practice areas")} ·{" "}
          {c(selected)}
        </p>
      </div>
      <PortfolioGrid items={visible} />
    </>
  );
}
