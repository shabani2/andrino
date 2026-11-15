"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireStaff } from "@/lib/admin-guard";

export type RubricState = { error: string | null; success: string | null };

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);

function values(data: FormData) {
  const titleFr = String(data.get("title_fr") ?? "").trim();
  const titleEn = String(data.get("title_en") ?? "").trim();
  const summaryFr = String(data.get("summary_fr") ?? "").trim();
  const summaryEn = String(data.get("summary_en") ?? "").trim();
  const slug = String(data.get("slug") ?? "").trim() || slugify(titleFr || titleEn);
  if (!titleFr || !titleEn) return { error: "Nom manquant. Renseignez le français et l’anglais." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) return { error: "Adresse invalide. Utilisez des minuscules, chiffres et tirets." };
  if (titleFr.length > 240 || titleEn.length > 240 || summaryFr.length > 2000 || summaryEn.length > 2000) return { error: "Texte trop long. Raccourcissez les champs." };
  return { titleFr, titleEn, summaryFr, summaryEn, slug };
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
    { entry_id: id, locale: "fr", title: form.titleFr, summary: form.summaryFr, state: "published" },
    { entry_id: id, locale: "en", title: form.titleEn, summary: form.summaryEn, state: "published" },
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
