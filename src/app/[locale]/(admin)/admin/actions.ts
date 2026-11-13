"use server";

import { redirect } from "next/navigation";
import { adminSessionClient } from "@/lib/admin-session";

export type LoginState = { error: string | null };

const copy = {
  fr: {
    fields: "Informations manquantes. Saisissez votre e-mail et votre mot de passe.",
    credentials: "Connexion impossible. Vérifiez votre e-mail et votre mot de passe.",
    access: "Accès refusé. Utilisez un compte d’équipe actif.",
  },
  en: {
    fields: "Information missing. Enter your email and password.",
    credentials: "Sign-in failed. Check your email and password.",
    access: "Access denied. Use an active team account.",
  },
} as const;

export async function signIn(locale: string, _state: LoginState, formData: FormData): Promise<LoginState> {
  const language = locale === "fr" ? "fr" : "en";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 1024) {
    return { error: copy[language].fields };
  }

  const supabase = await adminSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: copy[language].credentials };

  const staff = await supabase.from("staff_members")
    .select("role,active")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (staff.error || !staff.data?.active) {
    await supabase.auth.signOut();
    return { error: copy[language].access };
  }

  redirect(`/${language}/admin`);
}

export async function signOut(locale: string) {
  const language = locale === "fr" ? "fr" : "en";
  const supabase = await adminSessionClient();
  await supabase.auth.signOut();
  redirect(`/${language}/admin/login`);
}
