import { portfolioAreas } from "@/content/editorial";
import type { PortfolioItem } from "@/types/portfolio";
export function getPortfolioItems(): PortfolioItem[] {
  return portfolioAreas.map((item) => ({
    ...item,
    body: item.description,
    images: [item.image],
  }));
}
export function getPortfolioItemBySlug(slug: string) {
  return getPortfolioItems().find((item) => item.slug === slug);
}
