import { portfolioAreas } from "@/content/editorial";
import type { PortfolioItem } from "@/types/portfolio";
import type { Locale } from "@/i18n/routing";
import { getPublishedEntries } from "@/lib/content-repository";
import { hasSupabaseContent } from "@/lib/supabase";

function localPortfolioItems(): PortfolioItem[] {
  return portfolioAreas.map((item) => ({
    ...item,
    body: item.description,
    images: [item.image],
  }));
}
export async function getPortfolioItems(locale: Locale): Promise<PortfolioItem[]> {
  if (!hasSupabaseContent()) return localPortfolioItems();
  const entries = await getPublishedEntries(["practice_area", "case_study"], locale);
  return entries.map(({ translation: t, ...entry }) => ({
    slug: entry.slug,
    title: t.title,
    description: t.summary,
    body: t.body,
    category: t.category_label ?? entry.category_code ?? "",
    image: entry.cover_path ?? "/images/portfolio/portfolio-1.webp",
    images: entry.gallery_paths,
    alt: t.cover_alt,
    tags: entry.tags,
  }));
}
export async function getPortfolioItemBySlug(locale: Locale, slug: string) {
  return (await getPortfolioItems(locale)).find((item) => item.slug === slug);
}
