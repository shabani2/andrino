"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";

export async function setMessageStatus(locale: string, id: string, status: "new" | "handled") {
  const { supabase, language } = await requireStaff(locale);
  if (!/^[0-9a-f-]{36}$/.test(id) || !["new", "handled"].includes(status)) {
    throw new Error("Message invalide. Rechargez la page.");
  }
  const result = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (result.error) throw new Error("Mise à jour impossible. Réessayez.");
  revalidatePath(`/${language}/admin/messages`);
  revalidatePath(`/${language}/admin`);
}
