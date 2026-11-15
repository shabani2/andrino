import Link from "next/link";
import { requireStaff } from "@/lib/admin-guard";
import { privateSupabase } from "@/lib/supabase";
import { moderateComment } from "./actions";
import { TimeFilter } from "@/components/admin/time-filter";
import { timeFilter, timeRange } from "@/lib/time-filter";

export const metadata = { title: "Commentaires", robots: { index: false, follow: false } };

export default async function CommentsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ periode?: string }> }) {
  const { locale } = await params;
  const query = await searchParams;
  await requireStaff(locale);
  const fr = locale === "fr";
  const period = timeFilter(query.periode);
  const range = timeRange(period);
  const client = privateSupabase();
  let request = client.from("post_comments").select("id,entry_id,author_name,body,created_at")
    .eq("status", "pending").order("created_at", { ascending: true });
  if (range.after) request = request.gte("created_at", range.after);
  if (range.before) request = request.lt("created_at", range.before);
  const result = await request.limit(100);
  if (result.error) throw new Error("Commentaires indisponibles.");
  const comments = result.data ?? [];
  const ids = [...new Set(comments.map((comment) => comment.entry_id))];
  const entries = ids.length ? await client.from("entries").select("id,kind,slug").in("id", ids) : null;
  const titles = Object.fromEntries((entries?.data ?? []).map((entry) => [entry.id, entry]));
  return <div className="moderation-page">
    <h1>{fr ? "Commentaires" : "Comments"}</h1>
    <div className="admin-list-tools moderation-tools"><p>{fr ? "Relisez les nouveaux commentaires avant leur publication." : "Review new comments before publication."}</p><TimeFilter locale={locale} value={period} /></div>
    {comments.length === 0
      ? <div className="moderation-empty">{fr ? "Aucun commentaire en attente." : "No comments awaiting review."}</div>
      : <div className="moderation-list">{comments.map((comment) => {
        const entry = titles[comment.entry_id];
        const route = entry?.kind === "article" ? "writing" : "projects";
        return <article key={comment.id} className="moderation-card">
          <div className="moderation-meta"><strong>{comment.author_name}</strong>
            <time dateTime={comment.created_at}>{new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(comment.created_at))}</time></div>
          {entry && <Link href={`/${locale}/${route}/${entry.slug}`} target="_blank">
            {fr ? "Voir le contenu" : "View content"} · /{entry.slug}</Link>}
          <p>{comment.body}</p>
          <div className="moderation-actions">
            <form action={moderateComment.bind(null, locale)}><input type="hidden" name="id" value={comment.id} />
              <button type="submit" name="status" value="approved">{fr ? "Publier le commentaire" : "Publish comment"}</button></form>
            <form action={moderateComment.bind(null, locale)}><input type="hidden" name="id" value={comment.id} />
              <button type="submit" name="status" value="rejected">{fr ? "Rejeter le commentaire" : "Reject comment"}</button></form>
          </div>
        </article>;
      })}</div>}
  </div>;
}
