import type { PortfolioItem } from "@/types/portfolio";
import { PortfolioCard } from "./portfolio-card";
export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="portfolio-grid">
      {items.map((item) => (
        <PortfolioCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
