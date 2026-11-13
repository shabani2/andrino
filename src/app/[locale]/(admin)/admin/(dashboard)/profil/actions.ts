"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";
import { uploadPublicImage } from "@/lib/admin-media";

export type ProfileState = { error: string | null; success: string | null };

export async function saveProfile(locale: string, _state: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, user, language } = await requireStaff(locale);
  const fr = language === "fr";
  const displayName = String(formData.get("display_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (displayName.length > 120 || phone.length > 32 || (phone && !/^[+0-9 ()-]+$/.test(phone))) {
    return { error: fr
      ? "Profil invalide. Raccourcissez les champs ou vérifiez le téléphone."
      : "Invalid profile. Shorten the fields or check the phone number.", success: null };
  }

  let avatarPath: string | undefined;
  try {
    avatarPath = (await uploadPublicImage(supabase, formData.get("avatar_file"), `avatars/${user.id}`)) ?? undefined;
  } catch (error) {
    return { error: fr
      ? error instanceof Error ? error.message : "Image refusée. Choisissez un autre fichier."
      : "Image not uploaded. Choose a supported file under 4 MB.", success: null };
  }
  const updated = await supabase.from("staff_members").update({
    display_name: displayName || null,
    phone: phone || null,
    ...(avatarPath ? { avatar_path: avatarPath } : {}),
  }).eq("user_id", user.id);
  if (updated.error) return { error: fr
    ? "Profil non enregistré. Vérifiez les champs et réessayez."
    : "Profile not saved. Check the fields and try again.", success: null };
  revalidatePath(`/${language}/admin`, "layout");
  revalidatePath(`/${language}/admin/profil`);
  return { error: null, success: fr ? "Profil enregistré." : "Profile saved." };
}

export async function changePassword(locale: string, _state: ProfileState, formData: FormData): Promise<ProfileState> {
  const { supabase, user, language } = await requireStaff(locale);
  const fr = language === "fr";
  const current = String(formData.get("current_password") ?? "");
  const next = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm_password") ?? "");
  if (next.length < 12 || next !== confirm) {
    return { error: fr
      ? "Mot de passe invalide. Utilisez 12 caractères et confirmez la même valeur."
      : "Invalid password. Use 12 characters and confirm the same value.", success: null };
  }
  const verified = await supabase.auth.signInWithPassword({ email: user.email ?? "", password: current });
  if (verified.error) return { error: fr
    ? "Mot de passe actuel incorrect. Vérifiez sa saisie."
    : "Current password incorrect. Check it and try again.", success: null };
  const changed = await supabase.auth.updateUser({ password: next });
  if (changed.error) return { error: fr
    ? "Mot de passe non modifié. Réessayez avec un autre mot de passe."
    : "Password not changed. Try a different password.", success: null };
  return { error: null, success: fr ? "Mot de passe modifié." : "Password changed." };
}
