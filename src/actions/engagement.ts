"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { privateSupabase } from "@/lib/supabase";

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function visitorId() {
  const jar = await cookies();
  const stored = jar.get("andrino-visitor")?.value;
  if (stored && idPattern.test(stored)) return stored;
  const value = randomUUID();
  jar.set("andrino-visitor", value, { httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" });
  return value;
}

async function publishedEntry(entryId: string) {
  if (!idPattern.test(entryId)) return false;
  const result = await privateSupabase().from("entry_translations").select("entry_id")
    .eq("entry_id", entryId).eq("state", "published").limit(1);
  return Boolean(result.data?.length);
}

export async function toggleLike(entryId: string) {
  if (!await publishedEntry(entryId)) return;
  const visitor = await visitorId();
  const client = privateSupabase();
  const previous = await client.from("post_likes").select("entry_id").eq("entry_id", entryId)
    .eq("visitor_id", visitor).maybeSingle();
  if (previous.data) await client.from("post_likes").delete().eq("entry_id", entryId).eq("visitor_id", visitor);
  else await client.from("post_likes").insert({ entry_id: entryId, visitor_id: visitor });
}

export async function toggleFollow() {
  const visitor = await visitorId();
  const client = privateSupabase();
  const previous = await client.from("site_follows").select("visitor_id").eq("visitor_id", visitor).maybeSingle();
  if (previous.data) await client.from("site_follows").delete().eq("visitor_id", visitor);
  else await client.from("site_follows").insert({ visitor_id: visitor });
}

export type CommentState = { error: string | null; success: boolean };

export async function submitComment(entryId: string, _state: CommentState, data: FormData): Promise<CommentState> {
  if (!await publishedEntry(entryId)) return { error: "Article indisponible. Rechargez la page.", success: false };
  if (String(data.get("website") ?? "").trim()) return { error: null, success: true };
  const name = String(data.get("name") ?? "").trim();
  const body = String(data.get("body") ?? "").trim();
  if (name.length < 2 || name.length > 60 || body.length < 3 || body.length > 1500) {
    return { error: "Commentaire incomplet. Saisissez un nom et un texte de 3 à 1 500 caractères.", success: false };
  }
  if ((body.match(/https?:\/\//gi) ?? []).length > 1) {
    return { error: "Commentaire refusé. Retirez les liens supplémentaires.", success: false };
  }
  const visitor = await visitorId();
  const client = privateSupabase();
  const recent = await client.from("post_comments").select("created_at").eq("visitor_id", visitor)
    .order("created_at", { ascending: false }).limit(1);
  if (recent.data?.[0] && Date.now() - new Date(recent.data[0].created_at).getTime() < 120_000) {
    return { error: "Commentaire déjà envoyé. Réessayez dans deux minutes.", success: false };
  }
  const result = await client.from("post_comments").insert({ entry_id: entryId, visitor_id: visitor,
    author_name: name, body, status: "pending" });
  return result.error
    ? { error: "Envoi impossible. Réessayez plus tard.", success: false }
    : { error: null, success: true };
}
