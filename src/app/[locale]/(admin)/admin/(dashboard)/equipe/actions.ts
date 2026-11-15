"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";
import { uploadPublicImage } from "@/lib/admin-media";
import { privateSupabase } from "@/lib/supabase";

export type TeamState = { error: string | null; success: string | null };

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requestedRole(formData: FormData) {
  return formData.get("role") === "admin" ? "admin" : "editor";
}

function profileFields(formData: FormData) {
  const displayName = String(formData.get("display_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (displayName.length > 120 || phone.length > 32 || (phone && !/^[+0-9 ()-]+$/.test(phone))) return null;
  return { display_name: displayName || null, phone: phone || null };
}

async function keepAnotherAdmin(admin: ReturnType<typeof privateSupabase>, userId: string, role: string, active: boolean) {
  if (role === "admin" && active) return true;
  const others = await admin.from("staff_members").select("user_id", { count: "exact", head: true })
    .eq("role", "admin").eq("active", true).neq("user_id", userId);
  return !others.error && (others.count ?? 0) > 0;
}

async function findAuthUser(email: string) {
  const admin = privateSupabase();
  for (let page = 1; ; page += 1) {
    const result = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (result.error) throw new Error("Comptes indisponibles. Réessayez plus tard.");
    const match = result.data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (result.data.users.length < 1000) return null;
  }
}

export async function createMember(locale: string, _state: TeamState, formData: FormData): Promise<TeamState> {
  const { language, supabase } = await requireStaff(locale, true);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("password_confirmation") ?? "");
  if (!validEmail(email) || password.length < 12 || password.length > 1024 || password !== confirmation) {
    return { error: "Compte invalide. Vérifiez l’e-mail et confirmez un mot de passe de 12 caractères.", success: null };
  }
  const profile = profileFields(formData);
  if (!profile) return { error: "Profil invalide. Vérifiez le nom ou le téléphone.", success: null };
  const admin = privateSupabase();
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user) {
    return { error: "Compte non créé. Vérifiez l’adresse ou ajoutez le compte existant.", success: null };
  }
  let avatarPath: string | null = null;
  try {
    avatarPath = await uploadPublicImage(supabase, formData.get("avatar_file"), `avatars/${created.data.user.id}`);
  } catch (error) {
    await admin.auth.admin.deleteUser(created.data.user.id);
    return { error: error instanceof Error ? error.message : "Image refusée. Choisissez un autre fichier.", success: null };
  }
  const staff = await admin.from("staff_members").insert({
    user_id: created.data.user.id, role: requestedRole(formData), active: true, ...profile,
    ...(avatarPath ? { avatar_path: avatarPath } : {}),
  });
  if (staff.error) {
    await admin.auth.admin.deleteUser(created.data.user.id);
    return { error: "Accès non créé. Réessayez depuis la page équipe.", success: null };
  }
  revalidatePath(`/${language}/admin/equipe`);
  return { error: null, success: "Membre créé. Communiquez-lui ses identifiants par un canal sûr." };
}

export async function linkMember(locale: string, _state: TeamState, formData: FormData): Promise<TeamState> {
  const { language } = await requireStaff(locale, true);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!validEmail(email)) return { error: "Adresse invalide. Saisissez un e-mail complet.", success: null };
  let user;
  try {
    user = await findAuthUser(email);
  } catch {
    return { error: "Comptes indisponibles. Réessayez plus tard.", success: null };
  }
  if (!user) return { error: "Compte introuvable. Créez un membre avec un mot de passe initial.", success: null };
  const admin = privateSupabase();
  const existing = await admin.from("staff_members").select("user_id").eq("user_id", user.id).maybeSingle();
  if (existing.error) return { error: "Compte indisponible. Réessayez plus tard.", success: null };
  if (existing.data) return { error: "Membre déjà présent. Modifiez ses droits dans la liste.", success: null };
  const added = await admin.from("staff_members").insert({ user_id: user.id, role: requestedRole(formData), active: true });
  if (added.error) return { error: "Membre non ajouté. Réessayez plus tard.", success: null };
  revalidatePath(`/${language}/admin/equipe`);
  return { error: null, success: "Compte existant ajouté à l’équipe." };
}

export async function updateMember(
  locale: string,
  userId: string,
  _state: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const { user, language, supabase } = await requireStaff(locale, true);
  if (userId === user.id) return { error: "Modifiez votre profil depuis votre compte.", success: null };
  if (!/^[0-9a-f-]{36}$/.test(userId)) return { error: "Membre invalide. Rechargez la liste.", success: null };
  const role = requestedRole(formData);
  const active = formData.get("active") === "on";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const profile = profileFields(formData);
  if (!validEmail(email) || !profile) return { error: "Profil invalide. Vérifiez les champs.", success: null };
  const admin = privateSupabase();
  const current = await admin.from("staff_members").select("role,active").eq("user_id", userId).maybeSingle();
  if (current.error || !current.data) return { error: "Membre introuvable. Rechargez la liste.", success: null };
  if (current.data.role === "admin" && current.data.active && !await keepAnotherAdmin(admin, userId, role, active)) {
    return { error: "Un administrateur actif est requis. Gardez un autre administrateur.", success: null };
  }
  const auth = await admin.auth.admin.updateUserById(userId, { email, email_confirm: true });
  if (auth.error) return { error: "E-mail non modifié. Vérifiez cette adresse.", success: null };
  let avatarPath: string | null = null;
  try {
    avatarPath = await uploadPublicImage(supabase, formData.get("avatar_file"), `avatars/${userId}`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Image refusée. Choisissez un autre fichier.", success: null };
  }
  const updated = await admin.from("staff_members").update({ role, active, ...profile,
    ...(avatarPath ? { avatar_path: avatarPath } : {}) }).eq("user_id", userId);
  if (updated.error) return { error: "Droits non modifiés. Réessayez plus tard.", success: null };
  revalidatePath(`/${language}/admin`, "layout");
  return { error: null, success: "Membre enregistré." };
}

export async function deleteMember(locale: string, userId: string, _state: TeamState): Promise<TeamState> {
  void _state;
  const { user, language } = await requireStaff(locale, true);
  if (userId === user.id) return { error: "Supprimez un autre membre depuis cette page.", success: null };
  if (!/^[0-9a-f-]{36}$/.test(userId)) return { error: "Membre invalide. Rechargez la liste.", success: null };
  const admin = privateSupabase();
  const member = await admin.from("staff_members").select("role,active").eq("user_id", userId).maybeSingle();
  if (member.error || !member.data) return { error: "Membre introuvable. Rechargez la liste.", success: null };
  if (member.data.role === "admin" && member.data.active && !await keepAnotherAdmin(admin, userId, "editor", false)) {
    return { error: "Un administrateur actif est requis. Ajoutez-en un avant la suppression.", success: null };
  }
  const deleted = await admin.auth.admin.deleteUser(userId);
  if (deleted.error) return { error: "Compte non supprimé. Réessayez plus tard.", success: null };
  revalidatePath(`/${language}/admin`, "layout");
  return { error: null, success: "Compte supprimé." };
}
