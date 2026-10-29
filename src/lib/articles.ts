import { writingThemes } from "@/content/editorial";
import type { Article } from "@/types/article";
export function getArticles(): Article[] {
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
export function getArticleBySlug(slug: string) {
  return getArticles().find((item) => item.slug === slug);
}
