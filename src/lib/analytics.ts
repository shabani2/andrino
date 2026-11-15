import "server-only";
import { privateSupabase } from "@/lib/supabase";

type Totals = { views: number; visitors: number; readers: number };
export type ContentMetric = { entry_id: string; slug: string; kind: string; title: string; views: number; readers: number };
export type SiteAnalytics = { all_time: Totals; recent: Totals & { days: number }; today: Totals; top_content: ContentMetric[] };

const blank: Totals = { views: 0, visitors: 0, readers: 0 };
const count = (value: unknown) => typeof value === "number" ? value : 0;

function totals(value: unknown): Totals {
  const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return { views: count(item.views), visitors: count(item.visitors), readers: count(item.readers) };
}

export async function getSiteAnalytics(locale: string): Promise<SiteAnalytics> {
  const { data, error } = await privateSupabase().rpc("get_site_analytics", {
    p_locale: locale === "fr" ? "fr" : "en",
    p_days: 30,
  });
  if (error) throw new Error("Site analytics unavailable");

  const value = data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : {};
  const recent = totals(value.recent);
  const rawContent = Array.isArray(value.top_content) ? value.top_content : [];
  const top_content = rawContent.flatMap((item): ContentMetric[] => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.entry_id !== "string" || typeof row.slug !== "string" || typeof row.title !== "string" || typeof row.kind !== "string") return [];
    return [{ entry_id: row.entry_id, slug: row.slug, title: row.title, kind: row.kind, views: count(row.views), readers: count(row.readers) }];
  });

  return {
    all_time: totals(value.all_time),
    recent: { ...recent, days: count((value.recent as Record<string, unknown> | null)?.days) || 30 },
    today: totals(value.today),
    top_content,
  };
}

export const emptyAnalytics: SiteAnalytics = {
  all_time: blank,
  recent: { ...blank, days: 30 },
  today: blank,
  top_content: [],
};
