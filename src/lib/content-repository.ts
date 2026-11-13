import "server-only";
import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { publicSupabase } from "@/lib/supabase";

export type EntryKind = "article" | "writing_theme" | "project" | "practice_area" | "case_study";

async function queryPublishedEntries(kinds: EntryKind[], locale: Locale) {
  const { data, error } = await publicSupabase()
    .from("entries")
    .select("id, kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order, entry_translations!inner(locale, title, summary, body, category_label, project_status, cover_alt, seo_title, seo_description, state, published_at)")
    .in("kind", kinds)
    .eq("entry_translations.locale", locale)
    .eq("entry_translations.state", "published")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Supabase content query failed: ${error.message}`);
  return (data ?? []).flatMap((entry) => {
    const translation = entry.entry_translations[0];
    return translation ? [{ ...entry, translation }] : [];
  });
}

export const getPublishedEntries = unstable_cache(
  queryPublishedEntries,
  ["andrino-published-entries"],
  { revalidate: 60, tags: ["andrino-content"] },
);
