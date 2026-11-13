import Link from "next/link";
import { requireStaff } from "@/lib/admin-guard";
import { adminText } from "@/lib/admin-sections";
import { Button } from "@/components/ui/button";
import { setMessageStatus } from "./actions";

export const metadata = { title: "Messages reçus", robots: { index: false, follow: false } };

export default async function MessagesPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const parsed = Number(query.page ?? "1");
  const page = Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 10000) : 1;
  const { supabase } = await requireStaff(locale);
  const result = await supabase.from("contact_messages")
    .select("id,name,email,subject,message,locale,status,created_at", { count: "exact" })
    .order("created_at", { ascending: false }).range((page - 1) * 25, page * 25 - 1);
  if (result.error) throw new Error("Messages unavailable");

  return (
    <div>
      <p className="text-sm text-muted-foreground">{adminText(locale, "Correspondance", "Correspondence")}</p>
      <h1 className="mt-2 font-serif text-4xl">{adminText(locale, "Messages reçus", "Received messages")}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{result.count ?? 0} {adminText(locale, "messages", "messages")}</p>
      {result.data.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-6 text-muted-foreground">
          {adminText(locale, "Aucun message reçu. Revenez plus tard.", "No messages received. Check back later.")}
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {result.data.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{item.subject}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.name} · <a href={`mailto:${item.email}`} className="underline">{item.email}</a>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString(locale === "fr" ? "fr-FR" : "en-US", { timeZone: "Africa/Lagos" })}
                    {" · "}{item.locale.toUpperCase()}
                  </p>
                </div>
                <span className="rounded-full border border-border px-3 py-1 text-xs">
                  {item.status === "new" ? adminText(locale, "À traiter", "New") : adminText(locale, "Traité", "Handled")}
                </span>
              </div>
              <div className="mt-5 whitespace-pre-wrap border-t border-border pt-5 text-sm">{item.message}</div>
              <form action={setMessageStatus.bind(null, locale, item.id, item.status === "new" ? "handled" : "new")}
                className="mt-5">
                <Button type="submit" variant="outline" size="sm">
                  {item.status === "new"
                    ? adminText(locale, "Marquer comme traité", "Mark as handled")
                    : adminText(locale, "Remettre à traiter", "Mark as new")}
                </Button>
              </form>
            </article>
          ))}
        </div>
      )}
      <nav aria-label={adminText(locale, "Pages de messages", "Message pages")} className="mt-6 flex gap-4 text-sm">
        {page > 1 && <Link href={`/${locale}/admin/messages?page=${page - 1}`} className="underline">
          {adminText(locale, "Voir les précédents", "View previous")}
        </Link>}
        {page * 25 < (result.count ?? 0) && <Link href={`/${locale}/admin/messages?page=${page + 1}`} className="underline">
          {adminText(locale, "Voir les suivants", "View next")}
        </Link>}
      </nav>
    </div>
  );
}
