import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, FileText, Folder, Layers3, Mail, PenLine } from "lucide-react";
import { requireStaff } from "@/lib/admin-guard";
import { adminText, contentSections } from "@/lib/admin-sections";

export const metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { supabase, staff } = await requireStaff(locale);
  const sections = Object.values(contentSections);
  const [countsResult, messages, recent] = await Promise.all([
    Promise.all(sections.map((section) => supabase.from("entries")
      .select("id", { count: "exact", head: true }).eq("kind", section.kind))),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("entries").select("id,slug,kind,updated_at,entry_translations(locale,title)")
      .order("updated_at", { ascending: false }).limit(5),
  ]);
  if (countsResult.some((result) => result.error) || messages.error || recent.error) throw new Error("Admin overview unavailable");
  const counts = Object.fromEntries(sections.map(({ kind }, index) => [
    kind, countsResult[index].count ?? 0,
  ]));
  const sectionEntries = Object.entries(contentSections);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const sectionIcons = [FileText, Folder, Layers3, PenLine, BookOpen];

  return (
    <div>
      <div className="admin-dashboard-heading">
        <div>
          <p className="admin-dashboard-kicker">{adminText(locale, "Espace de gestion", "Management workspace")}</p>
          <h1 className="mt-2 font-serif">{adminText(locale, "Vue d’ensemble", "Overview")}</h1>
          <p className="admin-dashboard-intro">
            {staff.display_name
              ? adminText(locale, `Bonjour ${staff.display_name}. Voici vos contenus.`, `Hello ${staff.display_name}. Here is your content.`)
              : adminText(locale, "Retrouvez vos contenus et messages.", "Find your content and messages.")}
          </p>
        </div>
        <Link href={`/${locale}`} className="admin-dashboard-site-link">
          {adminText(locale, "Voir le site", "View site")}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-icon"><FileText size={18} aria-hidden="true" /></span>
          <span className="admin-stat-label">{adminText(locale, "Contenus", "Content")}</span>
          <strong className="admin-stat-number">{total}</strong>
          <span className="admin-stat-link">{adminText(locale, "Dans cinq rubriques", "Across five sections")}</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon"><Folder size={18} aria-hidden="true" /></span>
          <span className="admin-stat-label">{adminText(locale, "Projets", "Projects")}</span>
          <strong className="admin-stat-number">{counts.project}</strong>
          <Link className="admin-stat-link" href={`/${locale}/admin/projets`}>
            {adminText(locale, "Gérer les projets", "Manage projects")} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-icon"><Mail size={18} aria-hidden="true" /></span>
          <span className="admin-stat-label">{adminText(locale, "Messages à traiter", "New messages")}</span>
          <strong className="admin-stat-number">{messages.count ?? 0}</strong>
          <Link className="admin-stat-link" href={`/${locale}/admin/messages`}>
            {adminText(locale, "Voir les messages", "View messages")} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel" aria-labelledby="admin-sections-title">
          <div className="admin-panel-heading">
            <h2 id="admin-sections-title">{adminText(locale, "Gérer les contenus", "Manage content")}</h2>
          </div>
          {sectionEntries.map(([slug, section], index) => {
            const Icon = sectionIcons[index];
            return <Link key={slug} href={`/${locale}/admin/${slug}`} className="admin-collection-row">
              <span className="admin-collection-icon"><Icon size={17} aria-hidden="true" /></span>
              <span className="admin-collection-copy">
                <strong>{locale === "fr" ? section.fr : section.en}</strong>
                <small>{adminText(locale, "Voir et modifier", "View and edit")}</small>
              </span>
              <span className="admin-collection-count">{counts[section.kind]}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>;
          })}
        </section>

        <section className="admin-panel" aria-labelledby="admin-recent-title">
          <div className="admin-panel-heading">
            <h2 id="admin-recent-title">{adminText(locale, "Modifiés récemment", "Recently updated")}</h2>
          </div>
          {recent.data.length === 0 ? <p className="admin-empty">
            {adminText(locale, "Aucun contenu. Créez votre premier article.", "No content yet. Create your first article.")}
          </p> : recent.data.map((entry) => {
            const slug = sectionEntries.find(([, section]) => section.kind === entry.kind)?.[0];
            const title = entry.entry_translations.find((item) => item.locale === locale)?.title
              || entry.entry_translations[0]?.title || entry.slug;
            return <Link key={entry.id} href={`/${locale}/admin/${slug}/${entry.id}`} className="admin-recent-item">
              <strong>{title}</strong>
              <span>{new Date(entry.updated_at).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
                day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Lagos",
              })}</span>
            </Link>;
          })}
        </section>
      </div>
    </div>
  );
}
