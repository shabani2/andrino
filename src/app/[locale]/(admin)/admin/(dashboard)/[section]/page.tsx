import Link from "next/link";
import { Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { contentSections, isContentSection, adminText } from "@/lib/admin-sections";
import { RubricManager, type Rubric } from "../rubriques/rubric-manager";
import { privateSupabase } from "@/lib/supabase";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  const item = isContentSection(section) ? contentSections[section] : null;
  return { title: item ? (locale === "fr" ? item.fr : item.en) : "Articles",
    robots: { index: false, follow: false } };
}

export default async function ContentListPage({ params, searchParams }: {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, section } = await params;
  const query = await searchParams;
  const parsed = Number(query.page ?? "1");
  const page = Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 10000) : 1;
  if (!isContentSection(section)) notFound();
  const { supabase } = await requireStaff(locale);
  if (section === "rubriques") {
    const rubricsResult = await supabase.from("entries")
      .select("id,slug,entry_translations(locale,title,summary)")
      .eq("kind", "practice_area").order("sort_order", { ascending: true });
    if (rubricsResult.error) throw new Error("Rubric list unavailable");
    const rubrics = (rubricsResult.data ?? []).flatMap((entry): Rubric[] => {
      const fr = entry.entry_translations.find((item) => item.locale === "fr");
      const en = entry.entry_translations.find((item) => item.locale === "en");
      return fr && en ? [{ id: entry.id, slug: entry.slug, fr: { title: fr.title, summary: fr.summary }, en: { title: en.title, summary: en.summary } }] : [];
    });
    return <RubricManager locale={locale} rubrics={rubrics} />;
  }
  const result = await supabase.from("entries")
    .select("id,slug,updated_at,entry_translations(locale,title,state)", { count: "exact" })
    .eq("kind", contentSections[section].kind)
    .order("updated_at", { ascending: false }).range((page - 1) * 25, page * 25 - 1);
  if (result.error) throw new Error("Content list unavailable");
  const likesByEntry = new Map<string, number>();
  if (section === "articles" && result.data.length) {
    const likes = await privateSupabase().from("post_likes").select("entry_id").in("entry_id", result.data.map((entry) => entry.id));
    if (likes.error) throw new Error("Article likes unavailable");
    for (const like of likes.data ?? []) likesByEntry.set(like.entry_id, (likesByEntry.get(like.entry_id) ?? 0) + 1);
  }
  const title = locale === "fr" ? contentSections[section].fr : contentSections[section].en;
  const createLabel = section === "articles" ? adminText(locale, "Créer un article", "Create article")
    : section === "projets" ? adminText(locale, "Créer un projet", "Create project")
    : adminText(locale, "Créer une rubrique", "Create category");
  const emptyLabel = section === "articles" ? adminText(locale, "Aucun article. Créez le premier.", "No articles yet. Create the first one.")
    : section === "projets" ? adminText(locale, "Aucun projet. Créez le premier.", "No projects yet. Create the first one.")
    : adminText(locale, "Aucune rubrique. Créez la première.", "No categories yet. Create the first one.");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{adminText(locale, "Articles et projets", "Posts and projects")}</p>
          <h1 className="mt-2 font-serif text-4xl">{title}</h1>
        </div>
        <Link href={`/${locale}/admin/${section}/nouveau`} className="ui-action-primary rounded-lg px-5 py-3 text-sm font-medium">
          {createLabel}
        </Link>
      </div>
      {result.data.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {result.data.map((entry) => {
            const fr = entry.entry_translations.find((item) => item.locale === "fr");
            const en = entry.entry_translations.find((item) => item.locale === "en");
            const published = fr?.state === "published" || en?.state === "published";
            return (
              <Link key={entry.id} href={`/${locale}/admin/${section}/${entry.id}`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 last:border-0 hover:bg-muted/50">
                <div className="min-w-0">
                  <strong className="block truncate">{fr?.title || en?.title || entry.slug}</strong>
                  <span className="text-sm text-muted-foreground">/{entry.slug}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  {section === "articles" && published && <span className="admin-like-count"><Heart size={14} aria-hidden="true" /> {likesByEntry.get(entry.id) ?? 0}</span>}
                  <span className="rounded-full border border-border px-2 py-1">FR · {fr?.state === "published" ? adminText(locale, "Publié", "Published") : adminText(locale, "Brouillon", "Draft")}</span>
                  <span className="rounded-full border border-border px-2 py-1">EN · {en?.state === "published" ? adminText(locale, "Publié", "Published") : adminText(locale, "Brouillon", "Draft")}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <nav aria-label={adminText(locale, "Pages d’articles", "Post pages")} className="mt-6 flex gap-4 text-sm">
        {page > 1 && <Link href={`/${locale}/admin/${section}?page=${page - 1}`} className="underline">
          {adminText(locale, "Voir les précédents", "View previous")}
        </Link>}
        {page * 25 < (result.count ?? 0) && <Link href={`/${locale}/admin/${section}?page=${page + 1}`} className="underline">
          {adminText(locale, "Voir les suivants", "View next")}
        </Link>}
      </nav>
    </div>
  );
}
