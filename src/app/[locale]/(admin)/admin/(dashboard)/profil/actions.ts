"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";
import { uploadPublicImage } from "@/lib/admin-media";

export type ProfileState = { error: string | null; success: string | null };

export async function saveProfile(locale: string, _state: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, user, language } = await requireStaff(locale);
  const displayName = String(formData.get("display_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (displayName.length > 120 || phone.length > 32 || (phone && !/^[+0-9 ()-]+$/.test(phone))) {
    return { error: "Profil invalide. Raccourcissez les champs ou vérifiez le téléphone.", success: null };
  }

  let avatarPath: string | undefined;
  try {
    avatarPath = (await uploadPublicImage(supabase, formData.get("avatar_file"), `avatars/${user.id}`)) ?? undefined;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Image refusée. Choisissez un autre fichier.", success: null };
  }
  const updated = await supabase.from("staff_members").update({
    display_name: displayName || null,
    phone: phone || null,
    ...(avatarPath ? { avatar_path: avatarPath } : {}),
  }).eq("user_id", user.id);
  if (updated.error) return { error: "Profil non enregistré. Vérifiez les champs et réessayez.", success: null };
  revalidatePath(`/${language}/admin/profil`);
  return { error: null, success: "Profil enregistré." };
}

export async function changePassword(locale: string, _state: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, user } = await requireStaff(locale);
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  if (next.length < 12 || next !== confirm) {
    return { error: "Mot de passe invalide. Utilisez 12 caractères et confirmez la même valeur.", success: null };
  }
  const verified = await supabase.auth.signInWithPassword({ email: user.email ?? "", password: current });
  if (verified.error) return { error: "Mot de passe actuel incorrect. Vérifiez sa saisie.", success: null };
  const changed = await supabase.auth.updateUser({ password: next });
  if (changed.error) return { error: "Mot de passe non modifié. Réessayez avec un autre mot de passe.", success: null };
  return { error: null, success: "Mot de passe modifié." };
}
