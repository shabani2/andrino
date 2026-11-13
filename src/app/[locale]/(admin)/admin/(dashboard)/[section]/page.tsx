import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { contentSections, isContentSection, adminText } from "@/lib/admin-sections";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  const item = isContentSection(section) ? contentSections[section] : null;
  return { title: item ? (locale === "fr" ? item.fr : item.en) : "Contenus",
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
  const result = await supabase.from("entries")
    .select("id,slug,updated_at,entry_translations(locale,title,state)", { count: "exact" })
    .eq("kind", contentSections[section].kind)
    .order("updated_at", { ascending: false }).range((page - 1) * 25, page * 25 - 1);
  if (result.error) throw new Error("Content list unavailable");
  const title = locale === "fr" ? contentSections[section].fr : contentSections[section].en;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{adminText(locale, "Contenus", "Content")}</p>
          <h1 className="mt-2 font-serif text-4xl">{title}</h1>
        </div>
        <Link href={`/${locale}/admin/${section}/nouveau`} className="ui-action-primary rounded-lg px-5 py-3 text-sm font-medium">
          {adminText(locale, "Créer un contenu", "Create content")}
        </Link>
      </div>
      {result.data.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          {adminText(locale, "Aucun contenu. Créez le premier.", "No content yet. Create the first item.")}
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {result.data.map((entry) => {
            const fr = entry.entry_translations.find((item) => item.locale === "fr");
            const en = entry.entry_translations.find((item) => item.locale === "en");
            return (
              <Link key={entry.id} href={`/${locale}/admin/${section}/${entry.id}`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 last:border-0 hover:bg-muted/50">
                <div className="min-w-0">
                  <strong className="block truncate">{fr?.title || en?.title || entry.slug}</strong>
                  <span className="text-sm text-muted-foreground">/{entry.slug}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="rounded-full border border-border px-2 py-1">FR · {fr?.state === "published" ? adminText(locale, "Publié", "Published") : adminText(locale, "Brouillon", "Draft")}</span>
                  <span className="rounded-full border border-border px-2 py-1">EN · {en?.state === "published" ? adminText(locale, "Publié", "Published") : adminText(locale, "Brouillon", "Draft")}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <nav aria-label={adminText(locale, "Pages de contenus", "Content pages")} className="mt-6 flex gap-4 text-sm">
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
