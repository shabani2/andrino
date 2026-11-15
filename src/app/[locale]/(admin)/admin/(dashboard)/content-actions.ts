"use server";

import { updateTag, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { contentSections, isContentSection } from "@/lib/admin-sections";
import { uploadPublicImage, validImagePath } from "@/lib/admin-media";
import { getEmbeddedMedia } from "@/lib/media";
import { translateContent, type TranslatableContent } from "@/lib/content-translation";
import { identity } from "@/config/identity";
import type { Database } from "@/types/database";

export type ContentFormState = { error: string | null };
type Locale = "fr" | "en";
type Translation = Database["public"]["Tables"]["entry_translations"]["Row"];
type SubmittedTranslation = TranslatableContent & { state: "draft" | "published" };

const translatedFields = ["title", "summary", "body", "category_label", "project_status", "cover_alt"] as const;

function submittedTranslation(data: FormData, locale: Locale, previous?: Translation): SubmittedTranslation {
  const optional = (name: string, fallback: string | null | undefined) =>
    data.has(`${name}_${locale}`) ? field(data, `${name}_${locale}`) : fallback ?? "";
  return {
    title: field(data, `title_${locale}`),
    summary: field(data, `summary_${locale}`),
    body: field(data, `body_${locale}`),
    category_label: optional("category_label", previous?.category_label),
    project_status: optional("project_status", previous?.project_status),
    cover_alt: optional("cover_alt", previous?.cover_alt),
    state: field(data, `state_${locale}`) === "published" ? "published" : "draft",
  };
}

function contentChanged(submitted: SubmittedTranslation, previous?: Translation): boolean {
  return !previous || translatedFields.some((name) => submitted[name] !== (previous[name] ?? ""));
}

function field(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
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

  const titleFr = field(formData, "title_fr");
  const titleEn = field(formData, "title_en");
  const current = entryId ? await supabase.from("entries").select("*").eq("id", entryId).maybeSingle() : null;
  if (entryId && (current?.error || current?.data?.kind !== contentSections[section].kind)) {
    return { error: "Article ou projet introuvable. Revenez à la liste." };
  }
  const prior = current?.data;
  const slug = field(formData, "slug") || prior?.slug || slugify(titleFr || titleEn);
  const coverPath = formData.has("cover_path") ? field(formData, "cover_path") : prior?.cover_path ?? "";
  const gallery = formData.has("gallery_paths")
    ? field(formData, "gallery_paths").split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
    : prior?.gallery_paths ?? [];
  const tags = formData.has("tags")
    ? field(formData, "tags").split(",").map((item) => item.trim()).filter(Boolean)
    : prior?.tags ?? [];
  const externalUrl = formData.has("external_url") ? field(formData, "external_url")
    : getEmbeddedMedia(prior?.external_url) ? "" : prior?.external_url ?? "";
  const mediaUrl = formData.has("media_url") ? field(formData, "media_url")
    : getEmbeddedMedia(prior?.external_url) ? prior?.external_url ?? "" : "";
  const sortOrder = formData.has("sort_order") ? Number(field(formData, "sort_order") || "0") : prior?.sort_order ?? 0;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return { error: "Identifiant invalide. Utilisez des minuscules, chiffres et tirets." };
  }
  if (!titleFr && !titleEn) return { error: "Titre manquant. Renseignez au moins une langue." };
  if (titleFr.length > 240 || titleEn.length > 240 || tags.length > 20 || gallery.length > 20) {
    return { error: "Article trop long. Raccourcissez les titres ou les listes." };
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
  if (mediaUrl && !getEmbeddedMedia(mediaUrl)) {
    return { error: "Lien vidéo invalide. Utilisez une vidéo YouTube, Instagram ou TikTok." };
  }
  if (mediaUrl && externalUrl) {
    return { error: "Deux liens renseignés. Gardez la vidéo ou le lien du projet." };
  }

  const image = formData.get("cover_file");
  if (image instanceof File && image.size > 0 && (!image.type.startsWith("image/") || image.size > 4_000_000)) {
    return { error: "Image refusée. Choisissez un fichier de moins de 4 Mo." };
  }

  const previous = entryId ? await supabase.from("entry_translations")
    .select("*").eq("entry_id", entryId) : null;
  if (previous?.error) return { error: "Traductions indisponibles. Réessayez dans un instant." };
  const existing = Object.fromEntries((previous?.data ?? []).map((item) => [item.locale, item])) as Partial<Record<Locale, Translation>>;
  const translations: Record<Locale, SubmittedTranslation> = {
    fr: submittedTranslation(formData, "fr", existing.fr),
    en: submittedTranslation(formData, "en", existing.en),
  };
  const origin: Locale = language === "fr" ? "fr" : "en";
  const target: Locale = origin === "fr" ? "en" : "fr";
  const generatedFrom: Partial<Record<Locale, Locale>> = {};
  const autoRequested = (section === "articles" || section === "projets") &&
    formData.get("auto_translate") === "on";
  const targetWasEdited = existing[target]
    ? contentChanged(translations[target], existing[target])
    : Boolean(translations[target].title);
  const canGenerate = autoRequested && translations[origin].title && !targetWasEdited &&
    (!existing[target] || existing[target].generated_from_locale === origin);
  if (canGenerate) {
    generatedFrom[target] = origin;
    if (contentChanged(translations[origin], existing[origin]) || !existing[target]) {
      try {
        const generated = await translateContent(translations[origin], origin, process.env.CONTACT_EMAIL || identity.email);
        translations[target] = { ...generated, state: translations[origin].state };
      } catch (error) {
        console.error("Content translation failed", error);
        return { error: language === "fr"
          ? "Traduction indisponible. Réessayez ou désactivez la traduction automatique."
          : "Translation unavailable. Retry or turn off automatic translation." };
      }
    } else {
      translations[target].state = translations[origin].state;
    }
  }
  for (const translationLocale of ["fr", "en"] as const) {
    if (!translations[translationLocale].title && translations[translationLocale].state === "published") {
      return { error: language === "fr"
        ? "Publication impossible. Renseignez le titre de cette langue."
        : "Publication failed. Add a title for this language." };
    }
    if (translations[translationLocale].title.length > 240) {
      return { error: language === "fr"
        ? "Titre trop long. Raccourcissez la version traduite."
        : "Title too long. Shorten the translated version." };
    }
  }

  const entryFields = {
    slug,
    category_code: formData.has("category_code") ? field(formData, "category_code") || null : prior?.category_code ?? null,
    tags,
    cover_path: coverPath || null,
    gallery_paths: gallery,
    external_url: mediaUrl || externalUrl || null,
    featured: formData.get("featured") === "on",
    sort_order: sortOrder,
  };
  let id = entryId;
  let created = false;
  if (id) {
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

    for (const translationLocale of ["fr", "en"] as const) {
      const submitted = translations[translationLocale];
      const title = submitted.title;
      if (!title) {
        if (existing[translationLocale]) {
          const removed = await supabase.from("entry_translations")
            .delete().eq("entry_id", id).eq("locale", translationLocale);
          if (removed.error) throw removed.error;
        }
        continue;
      }
      const desiredState = submitted.state;
      const priorTranslation = existing[translationLocale];
      const publishedAt = desiredState === "published"
        ? priorTranslation?.published_at ?? new Date().toISOString()
        : null;
      const translation = {
        entry_id: id,
        locale: translationLocale,
        title,
        summary: submitted.summary,
        body: submitted.body,
        category_label: submitted.category_label || null,
        project_status: submitted.project_status || null,
        cover_alt: submitted.cover_alt,
        generated_from_locale: generatedFrom[translationLocale] ?? (
          translationLocale === origin && !contentChanged(submitted, priorTranslation)
            ? priorTranslation?.generated_from_locale ?? null : null
        ),
        seo_title: generatedFrom[translationLocale] ? submitted.title : priorTranslation?.seo_title ?? null,
        seo_description: generatedFrom[translationLocale] ? submitted.summary : priorTranslation?.seo_description ?? null,
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
