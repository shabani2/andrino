import { writingThemes } from "@/content/editorial";
import type { Article } from "@/types/article";
import type { Locale } from "@/i18n/routing";
import { getPublishedEntries } from "@/lib/content-repository";
import { hasSupabaseContent } from "@/lib/supabase";

function localArticles(): Article[] {
  return writingThemes.map((item) => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.description,
    body: item.description,
    category: item.category,
    coverImage: item.image,
    alt: item.alt,
    tags: item.tags,
    status: "forthcoming",
  }));
}
export async function getArticles(locale: Locale): Promise<Article[]> {
  if (!hasSupabaseContent()) return localArticles();
  const entries = await getPublishedEntries(["writing_theme", "article"], locale);
  return entries.map(({ translation: t, ...entry }) => ({
    slug: entry.slug,
    title: t.title,
    excerpt: t.summary,
    body: t.body,
    category: t.category_label ?? entry.category_code ?? "",
    coverImage: entry.cover_path ?? "/images/articles/writing-1.webp",
    alt: t.cover_alt,
    tags: entry.tags,
    publishedAt: t.published_at ?? undefined,
    status: entry.kind === "article" ? "published" as const : "forthcoming" as const,
  })).sort((a, b) => {
    if (a.status !== b.status) return a.status === "published" ? -1 : 1;
    return a.status === "published" && b.status === "published"
      ? (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")
      : 0;
  });
}
export async function getArticleBySlug(locale: Locale, slug: string) {
  return (await getArticles(locale)).find((item) => item.slug === slug);
}
