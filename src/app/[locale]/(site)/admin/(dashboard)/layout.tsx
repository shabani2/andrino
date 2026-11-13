import Link from "next/link";
import type { ReactNode } from "react";
import { requireStaff } from "@/lib/admin-guard";
import { adminText, contentSections } from "@/lib/admin-sections";
import { signOut } from "../actions";

export default async function AdminLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { staff } = await requireStaff(locale);
  const links = [
    { href: "", label: adminText(locale, "Vue d’ensemble", "Overview") },
    ...Object.entries(contentSections).map(([slug, section]) => ({
      href: slug, label: locale === "fr" ? section.fr : section.en,
    })),
    { href: "messages", label: adminText(locale, "Messages", "Messages") },
    { href: "profil", label: adminText(locale, "Mon profil", "My profile") },
    ...(staff.role === "admin" ? [{ href: "equipe", label: adminText(locale, "Équipe", "Team") }] : []),
  ];

  return (
    <section className="section-padding min-h-[75vh]">
      <div className="editorial-container grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {adminText(locale, "Administration", "Administration")}
          </p>
          <nav aria-label={adminText(locale, "Gestion", "Management")} className="mt-5 flex flex-wrap gap-1 lg:flex-col">
            {links.map((link) => (
              <Link key={link.href} href={`/${locale}/admin${link.href ? `/${link.href}` : ""}`}
                className="rounded-lg px-3 py-2 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
                {link.label}
              </Link>
            ))}
          </nav>
          <form action={signOut.bind(null, locale)} className="mt-5 border-t border-border pt-4">
            <button type="submit" className="px-3 text-sm text-muted-foreground hover:text-foreground">
              {adminText(locale, "Se déconnecter", "Sign out")}
            </button>
          </form>
        </aside>
        <div id="admin-main" className="min-w-0" tabIndex={-1}>{children}</div>
      </div>
    </section>
  );
}
