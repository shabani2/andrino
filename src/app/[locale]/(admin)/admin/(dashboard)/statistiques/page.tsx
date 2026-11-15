import Link from "next/link";
import { BarChart3, Eye, FileText, UsersRound } from "lucide-react";
import { requireStaff } from "@/lib/admin-guard";
import { getSiteAnalytics } from "@/lib/analytics";
import { adminText } from "@/lib/admin-sections";

export const metadata = { title: "Statistiques", robots: { index: false, follow: false } };

export default async function AnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  await requireStaff(locale, true);
  const data = await getSiteAnalytics(locale);
  const fr = locale === "fr";
  const routeFor = (kind: string) => kind === "article" ? "articles" : "projets";

  return <div className="analytics-page">
    <div className="admin-dashboard-heading">
      <div>
        <p className="admin-dashboard-kicker">{adminText(locale, "Fréquentation", "Traffic")}</p>
        <h1 className="mt-2 font-serif">{adminText(locale, "Statistiques du site", "Site statistics")}</h1>
        <p className="admin-dashboard-intro">
          {adminText(locale, "Les visites sont comptées sans données personnelles.", "Visits are counted without personal data.")}
        </p>
      </div>
    </div>

    <section className="analytics-section" aria-labelledby="analytics-today">
      <div className="analytics-section-heading"><h2 id="analytics-today">{adminText(locale, "Aujourd’hui", "Today")}</h2></div>
      <div className="admin-stats analytics-stats">
        <Metric icon={<Eye size={18} />} label={adminText(locale, "Visites", "Visits")} value={data.today.views} />
        <Metric icon={<UsersRound size={18} />} label={adminText(locale, "Visiteurs", "Visitors")} value={data.today.visitors} />
        <Metric icon={<FileText size={18} />} label={adminText(locale, "Lecteurs", "Readers")} value={data.today.readers} />
      </div>
    </section>

    <section className="analytics-section" aria-labelledby="analytics-recent">
      <div className="analytics-section-heading"><h2 id="analytics-recent">{fr ? "Sur les 30 derniers jours" : "Last 30 days"}</h2></div>
      <div className="admin-stats analytics-stats">
        <Metric icon={<Eye size={18} />} label={adminText(locale, "Visites", "Visits")} value={data.recent.views} />
        <Metric icon={<UsersRound size={18} />} label={adminText(locale, "Visiteurs uniques", "Unique visitors")} value={data.recent.visitors} />
        <Metric icon={<FileText size={18} />} label={adminText(locale, "Lecteurs uniques", "Unique readers")} value={data.recent.readers} />
      </div>
    </section>

    <section className="analytics-section analytics-content-section" aria-labelledby="analytics-content">
      <div className="analytics-section-heading">
        <div><h2 id="analytics-content">{adminText(locale, "Contenus les plus lus", "Most-read content")}</h2>
          <p>{fr ? "Sur les 30 derniers jours." : "Over the last 30 days."}</p></div>
        <span className="analytics-total">{fr ? `${data.all_time.views} visites depuis le début` : `${data.all_time.views} visits all time`}</span>
      </div>
      {data.top_content.length === 0 ? <p className="admin-empty">{adminText(locale, "Aucune lecture enregistrée.", "No reads recorded.")}</p>
        : <div className="analytics-list">{data.top_content.map((entry) => <Link key={entry.entry_id}
          href={`/${locale}/admin/${routeFor(entry.kind)}/${entry.entry_id}`} className="analytics-row">
          <span className="analytics-row-icon"><BarChart3 size={17} aria-hidden="true" /></span>
          <span className="analytics-row-copy"><strong>{entry.title}</strong><small>{entry.kind === "article" ? (fr ? "Article" : "Post") : (fr ? "Projet" : "Project")}</small></span>
          <span className="analytics-count"><strong>{entry.views}</strong><small>{fr ? "visites" : "views"}</small></span>
          <span className="analytics-count"><strong>{entry.readers}</strong><small>{fr ? "lecteurs" : "readers"}</small></span>
        </Link>)}</div>}
    </section>
  </div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="admin-stat"><span className="admin-stat-icon" aria-hidden="true">{icon}</span>
    <span className="admin-stat-label">{label}</span><strong className="admin-stat-number">{value}</strong>
  </div>;
}
