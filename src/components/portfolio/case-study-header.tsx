import type { PortfolioItem } from "@/types/portfolio";
import { PageHero } from "@/components/shared/page-hero";

export function CaseStudyHeader({ item }: { item: PortfolioItem }) {
  return <PageHero title={item.title} description={item.description} />;
}
