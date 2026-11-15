"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";
import { identity } from "@/config/identity";
import { translateContent } from "@/lib/content-translation";

export type RubricState = { error: string | null; success: string | null };

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);

function values(data: FormData) {
  const title = String(data.get("title") ?? "").trim();
  const summary = String(data.get("summary") ?? "").trim();
  const slug = slugify(title);
  if (!title) return { error: "Nom manquant. Saisissez le nom de la rubrique." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) return { error: "Adresse invalide. Utilisez des minuscules, chiffres et tirets." };
  if (title.length > 240 || summary.length > 2000) return { error: "Texte trop long. Raccourcissez les champs." };
  return { title, summary, slug };
}

function refreshRubrics(language: string) {
  updateTag("andrino-content");
  for (const locale of ["fr", "en"]) {
    revalidatePath(`/${locale}/portfolio`);
    revalidatePath(`/${locale}/admin/rubriques`);
  }
  revalidatePath(`/${language}/admin`);
}

export async function saveRubric(locale: string, entryId: string | null, _state: RubricState, formData: FormData): Promise<RubricState> {
  const { supabase, language } = await requireStaff(locale);
  const form = values(formData);
  if ("error" in form) return { error: form.error ?? "Rubrique invalide. Vérifiez les champs.", success: null };
  if (entryId && !/^[0-9a-f-]{36}$/i.test(entryId)) return { error: "Rubrique introuvable. Rechargez la page.", success: null };
  const sourceLocale = language === "fr" ? "fr" : "en";
  const targetLocale = sourceLocale === "fr" ? "en" : "fr";
  let translated;
  try {
    translated = await translateContent({ title: form.title, summary: form.summary, body: "", category_label: "", project_status: "", cover_alt: "" }, sourceLocale, identity.email);
  } catch {
    return { error: "Traduction indisponible. Réessayez dans un instant.", success: null };
  }

  let id = entryId;
  if (id) {
    const current = await supabase.from("entries").select("kind").eq("id", id).maybeSingle();
    if (current.error || current.data?.kind !== "practice_area") return { error: "Rubrique introuvable. Rechargez la page.", success: null };
    const updated = await supabase.from("entries").update({ slug: form.slug }).eq("id", id);
    if (updated.error) return { error: updated.error.code === "23505" ? "Adresse déjà utilisée. Choisissez-en une autre." : "Rubrique non enregistrée. Réessayez plus tard.", success: null };
  } else {
    const created = await supabase.from("entries").insert({ kind: "practice_area", slug: form.slug }).select("id").single();
    if (created.error || !created.data) return { error: created.error?.code === "23505" ? "Adresse déjà utilisée. Choisissez-en une autre." : "Rubrique non créée. Réessayez plus tard.", success: null };
    id = created.data.id;
  }
  const translations = [
    { entry_id: id, locale: sourceLocale, title: form.title, summary: form.summary, state: "published", generated_from_locale: null },
    { entry_id: id, locale: targetLocale, title: translated.title, summary: translated.summary, state: "published", generated_from_locale: sourceLocale },
  ];
  const saved = await supabase.from("entry_translations").upsert(translations, { onConflict: "entry_id,locale" });
  if (saved.error) return { error: "Rubrique non enregistrée. Réessayez plus tard.", success: null };
  refreshRubrics(language);
  return { error: null, success: entryId ? "Rubrique enregistrée." : "Rubrique créée." };
}

export async function deleteRubric(locale: string, entryId: string, _state: RubricState): Promise<RubricState> {
  void _state;
  const { supabase, language } = await requireStaff(locale);
  if (!/^[0-9a-f-]{36}$/i.test(entryId)) return { error: "Rubrique introuvable. Rechargez la page.", success: null };
  const deleted = await supabase.from("entries").delete().eq("id", entryId).eq("kind", "practice_area");
  if (deleted.error) return { error: "Rubrique non supprimée. Réessayez plus tard.", success: null };
  refreshRubrics(language);
  return { error: null, success: "Rubrique supprimée." };
}
