"use server";

import { updateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { contentSections, isContentSection } from "@/lib/admin-sections";
import { uploadPublicImage, validImagePath } from "@/lib/admin-media";

export type ContentFormState = { error: string | null };

function field(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

function refreshContent() {
  updateTag("andrino-content");
  revalidatePath("/sitemap.xml");
  for (const language of ["fr", "en"]) {
    revalidatePath(`/${language}`);
    for (const route of ["writing", "projects", "portfolio"]) {
      revalidatePath(`/${language}/${route}`);
    }
  }
}

export async function saveContent(
  locale: string,
  section: string,
  entryId: string | null,
  _state: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const { supabase, language } = await requireStaff(locale);
  if (!isContentSection(section)) return { error: "Rubrique inconnue. Revenez à l’administration." };

  const slug = field(formData, "slug");
  const titleFr = field(formData, "title_fr");
  const titleEn = field(formData, "title_en");
  const coverPath = field(formData, "cover_path");
  const gallery = field(formData, "gallery_paths").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const tags = field(formData, "tags").split(",").map((item) => item.trim()).filter(Boolean);
  const externalUrl = field(formData, "external_url");
  const sortOrder = Number(field(formData, "sort_order") || "0");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return { error: "Identifiant invalide. Utilisez des minuscules, chiffres et tirets." };
  }
  if (!titleFr && !titleEn) return { error: "Titre manquant. Renseignez au moins une langue." };
  if ((!titleFr && field(formData, "state_fr") === "published") ||
      (!titleEn && field(formData, "state_en") === "published")) {
    return { error: "Publication impossible. Renseignez le titre de cette langue." };
  }
  if (titleFr.length > 240 || titleEn.length > 240 || tags.length > 20 || gallery.length > 20) {
    return { error: "Contenu trop long. Raccourcissez les titres ou les listes." };
  }
  if (!Number.isInteger(sortOrder) || sortOrder < -10000 || sortOrder > 10000) {
    return { error: "Ordre invalide. Saisissez un nombre entier entre -10000 et 10000." };
  }
  if (!validImagePath(coverPath) || gallery.some((path) => !validImagePath(path))) {
    return { error: "Chemin d’image invalide. Utilisez une image locale ou du stockage Supabase." };
  }
  if (externalUrl && (!URL.canParse(externalUrl) || !["https:", "http:"].includes(new URL(externalUrl).protocol))) {
    return { error: "Lien externe invalide. Saisissez une adresse HTTP ou HTTPS." };
  }

  const image = formData.get("cover_file");
  if (image instanceof File && image.size > 0 && (!image.type.startsWith("image/") || image.size > 4_000_000)) {
    return { error: "Image refusée. Choisissez un fichier de moins de 4 Mo." };
  }

  const entryFields = {
    slug,
    category_code: field(formData, "category_code") || null,
    tags,
    cover_path: coverPath || null,
    gallery_paths: gallery,
    external_url: externalUrl || null,
    featured: formData.get("featured") === "on",
    sort_order: sortOrder,
  };
  let id = entryId;
  let created = false;
  if (id) {
    const current = await supabase.from("entries").select("id,kind").eq("id", id).maybeSingle();
    if (current.error || current.data?.kind !== contentSections[section].kind) {
      return { error: "Contenu introuvable. Revenez à la liste." };
    }
    const saved = await supabase.from("entries").update(entryFields).eq("id", id);
    if (saved.error) return { error: saved.error.code === "23505"
      ? "Identifiant déjà utilisé. Choisissez un autre identifiant."
      : "Enregistrement impossible. Vérifiez les champs et réessayez." };
  } else {
    const saved = await supabase.from("entries")
      .insert({ ...entryFields, kind: contentSections[section].kind }).select("id").single();
    if (saved.error || !saved.data) return { error: saved.error?.code === "23505"
      ? "Identifiant déjà utilisé. Choisissez un autre identifiant."
      : "Création impossible. Vérifiez les champs et réessayez." };
    id = saved.data.id;
    created = true;
  }

  try {
    const uploaded = await uploadPublicImage(supabase, image, `entries/${id}`);
    if (uploaded) {
      const changed = await supabase.from("entries").update({ cover_path: uploaded }).eq("id", id);
      if (changed.error) throw changed.error;
    }

    const previous = await supabase.from("entry_translations")
      .select("locale,published_at").eq("entry_id", id);
    if (previous.error) throw previous.error;
    for (const translationLocale of ["fr", "en"] as const) {
      const title = translationLocale === "fr" ? titleFr : titleEn;
      if (!title) {
        if (previous.data.some((item) => item.locale === translationLocale)) {
          const removed = await supabase.from("entry_translations")
            .delete().eq("entry_id", id).eq("locale", translationLocale);
          if (removed.error) throw removed.error;
        }
        continue;
      }
      const desiredState = field(formData, `state_${translationLocale}`) === "published" ? "published" : "draft";
      const publishedAt = desiredState === "published"
        ? previous.data.find((item) => item.locale === translationLocale)?.published_at ?? new Date().toISOString()
        : null;
      const translation = {
        entry_id: id,
        locale: translationLocale,
        title,
        summary: field(formData, `summary_${translationLocale}`),
        body: field(formData, `body_${translationLocale}`),
        category_label: field(formData, `category_label_${translationLocale}`) || null,
        project_status: field(formData, `project_status_${translationLocale}`) || null,
        cover_alt: field(formData, `cover_alt_${translationLocale}`),
        seo_title: field(formData, `seo_title_${translationLocale}`) || null,
        seo_description: field(formData, `seo_description_${translationLocale}`) || null,
        state: desiredState,
        published_at: publishedAt,
      };
      const saved = await supabase.from("entry_translations").upsert(translation, { onConflict: "entry_id,locale" });
      if (saved.error) throw saved.error;
    }
  } catch (error) {
    console.error("Content save failed", error);
    if (created) await supabase.from("entries").delete().eq("id", id);
    return { error: "Enregistrement incomplet. Vérifiez l’image et les traductions, puis réessayez." };
  }

  refreshContent();
  redirect(`/${language}/admin/${section}`);
}

export async function deleteContent(locale: string, section: string, entryId: string) {
  const { supabase, language } = await requireStaff(locale);
  if (!isContentSection(section)) redirect(`/${language}/admin`);
  const entry = await supabase.from("entries").select("kind").eq("id", entryId).maybeSingle();
  if (entry.data?.kind !== contentSections[section].kind) redirect(`/${language}/admin/${section}`);
  const deleted = await supabase.from("entries").delete().eq("id", entryId);
  if (deleted.error) throw new Error("Suppression impossible. Réessayez depuis la liste.");
  refreshContent();
  redirect(`/${language}/admin/${section}`);
}
