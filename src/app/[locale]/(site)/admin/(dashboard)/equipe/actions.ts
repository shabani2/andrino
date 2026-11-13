"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";
import { privateSupabase } from "@/lib/supabase";

export type TeamState = { error: string | null; success: string | null };

function validEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function requestedRole(formData: FormData) {
  return formData.get("role") === "admin" ? "admin" : "editor";
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
  const { language } = await requireStaff(locale, true);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("password_confirmation") ?? "");
  if (!validEmail(email) || password.length < 12 || password.length > 1024 || password !== confirmation) {
    return { error: "Compte invalide. Vérifiez l’e-mail et confirmez un mot de passe de 12 caractères.", success: null };
  }
  const admin = privateSupabase();
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error || !created.data.user) {
    return { error: "Compte non créé. Vérifiez l’adresse ou ajoutez le compte existant.", success: null };
  }
  const staff = await admin.from("staff_members").insert({
    user_id: created.data.user.id, role: requestedRole(formData), active: true,
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
  const { user, language } = await requireStaff(locale, true);
  if (userId === user.id) return { error: "Votre accès reste administrateur. Modifiez un autre membre.", success: null };
  if (!/^[0-9a-f-]{36}$/.test(userId)) return { error: "Membre invalide. Rechargez la liste.", success: null };
  const role = requestedRole(formData);
  const active = formData.get("active") === "on";
  const admin = privateSupabase();
  const updated = await admin.from("staff_members").update({ role, active }).eq("user_id", userId);
  if (updated.error) return { error: "Droits non modifiés. Réessayez plus tard.", success: null };
  revalidatePath(`/${language}/admin/equipe`);
  return { error: null, success: "Droits du membre enregistrés." };
}
