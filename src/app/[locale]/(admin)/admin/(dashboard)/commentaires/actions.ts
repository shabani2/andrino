"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";
import { privateSupabase } from "@/lib/supabase";

export async function moderateComment(locale: string, data: FormData) {
  await requireStaff(locale);
  const id = String(data.get("id") ?? "");
  const status = String(data.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/.test(id) || !["approved", "rejected"].includes(status)) return;
  const client = privateSupabase();
  const comment = await client.from("post_comments").select("entry_id").eq("id", id).maybeSingle();
  if (!comment.data) return;
  const result = await client.from("post_comments").update({ status }).eq("id", id);
  if (result.error) throw new Error("Modération impossible. Réessayez.");
  const entry = await client.from("entries").select("kind,slug").eq("id", comment.data.entry_id).maybeSingle();
  if (entry.data) {
    const route = entry.data.kind === "article" ? "writing" : "projects";
    for (const language of ["fr", "en"]) revalidatePath(`/${language}/${route}/${entry.data.slug}`);
  }
  revalidatePath(`/${locale}/admin/commentaires`);
}
