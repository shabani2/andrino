import { projectDirections } from "@/content/editorial";
import type { Project } from "@/types/project";
import type { Locale } from "@/i18n/routing";
import { getPublishedEntries } from "@/lib/content-repository";
import { hasSupabaseContent } from "@/lib/supabase";

function localProjects(): Project[] {
  return projectDirections.map((item, index) => ({
    ...item,
    body: item.paragraphs.join("\n\n"),
    images: [item.image],
    featured: index === 0,
  }));
}
export async function getProjects(locale: Locale): Promise<Project[]> {
  if (!hasSupabaseContent()) return localProjects();
  const entries = await getPublishedEntries(["project"], locale);
  return entries.map(({ translation: t, ...entry }) => ({
    slug: entry.slug,
    title: t.title,
    description: t.summary,
    body: t.body,
    paragraphs: t.body.split(/\n\s*\n/).filter(Boolean),
    image: entry.cover_path ?? "/images/projects/projects-1.webp",
    images: entry.gallery_paths,
    alt: t.cover_alt,
    status: t.project_status ?? "",
    tags: entry.tags,
    featured: entry.featured,
    ...(entry.external_url ? { url: entry.external_url } : {}),
  }));
}
export async function getProjectBySlug(locale: Locale, slug: string) {
  return (await getProjects(locale)).find((item) => item.slug === slug);
}
