import "server-only";
import { cookies } from "next/headers";
import { privateSupabase } from "@/lib/supabase";

export type PublicComment = { id: string; author_name: string; body: string; created_at: string };

export async function getEngagement(entryId: string) {
  const client = privateSupabase();
  const visitorId = (await cookies()).get("andrino-visitor")?.value;
  const [likes, follows, comments, liked, following] = await Promise.all([
    client.from("post_likes").select("*", { count: "exact", head: true }).eq("entry_id", entryId),
    client.from("site_follows").select("*", { count: "exact", head: true }),
    client.from("post_comments").select("id,author_name,body,created_at").eq("entry_id", entryId)
      .eq("status", "approved").order("created_at", { ascending: false }).limit(100),
    visitorId ? client.from("post_likes").select("entry_id").eq("entry_id", entryId).eq("visitor_id", visitorId).maybeSingle() : Promise.resolve(null),
    visitorId ? client.from("site_follows").select("visitor_id").eq("visitor_id", visitorId).maybeSingle() : Promise.resolve(null),
  ]);
  if (likes.error || follows.error || comments.error) return null;
  return {
    likes: likes.count ?? 0,
    followers: follows.count ?? 0,
    comments: (comments.data ?? []) as PublicComment[],
    liked: Boolean(liked?.data),
    following: Boolean(following?.data),
  };
}
