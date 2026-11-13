import Link from "next/link";
import { requireStaff } from "@/lib/admin-guard";
import { adminText, contentSections } from "@/lib/admin-sections";

export const metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { supabase, staff } = await requireStaff(locale);
  const sections = Object.values(contentSections);
  const [countsResult, messages] = await Promise.all([
    Promise.all(sections.map((section) => supabase.from("entries")
      .select("id", { count: "exact", head: true }).eq("kind", section.kind))),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  if (countsResult.some((result) => result.error) || messages.error) throw new Error("Admin overview unavailable");
  const counts = Object.fromEntries(sections.map(({ kind }, index) => [
    kind, countsResult[index].count ?? 0,
  ]));

  return (
    <div>
      <p className="text-sm text-muted-foreground">{staff.display_name || adminText(locale, "Votre espace", "Your space")}</p>
      <h1 className="mt-2 font-serif text-4xl">{adminText(locale, "Vue d’ensemble", "Overview")}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Object.entries(contentSections).map(([slug, section]) => (
          <Link key={slug} href={`/${locale}/admin/${slug}`}
            className="rounded-2xl border border-border bg-card p-5 hover:border-primary focus-visible:outline-2 focus-visible:outline-ring">
            <strong className="block text-xl">{locale === "fr" ? section.fr : section.en}</strong>
            <span className="mt-2 block text-sm text-muted-foreground">
              {counts[section.kind]} {adminText(locale, "contenus", "items")}
            </span>
          </Link>
        ))}
        <Link href={`/${locale}/admin/messages`}
          className="rounded-2xl border border-border bg-card p-5 hover:border-primary focus-visible:outline-2 focus-visible:outline-ring">
          <strong className="block text-xl">{adminText(locale, "Messages reçus", "Received messages")}</strong>
          <span className="mt-2 block text-sm text-muted-foreground">
            {messages.count ?? 0} {adminText(locale, "à traiter", "to handle")}
          </span>
        </Link>
      </div>
    </div>
  );
}
