"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database";
import { deleteContent, saveContent, type ContentFormState } from "../content-actions";

type Entry = Database["public"]["Tables"]["entries"]["Row"];
type Translation = Database["public"]["Tables"]["entry_translations"]["Row"];
type Content = Entry & { entry_translations: Translation[] };
const initial: ContentFormState = { error: null };

function FormField({ label, name, defaultValue, hint, required = false }: {
  label: string; name: string; defaultValue?: string | number | null; hint?: string; required?: boolean;
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Input name={name} defaultValue={defaultValue ?? ""} required={required} />
      {hint && <span className="block text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function ContentEditor({ locale, section, sectionTitle, entry }: {
  locale: string; section: string; sectionTitle: string; entry?: Content | null;
}) {
  const [state, action, pending] = useActionState(saveContent.bind(null, locale, section, entry?.id ?? null), initial);
  const fr = locale === "fr";
  const translations = Object.fromEntries((entry?.entry_translations ?? []).map((item) => [item.locale, item]));

  return (
    <div>
      <Link href={`/${locale}/admin/${section}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← {fr ? "Retour à la liste" : "Back to list"}
      </Link>
      <h1 className="mt-4 font-serif text-4xl">
        {entry ? (fr ? "Modifier le contenu" : "Edit content") : (fr ? "Créer un contenu" : "Create content")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{sectionTitle}</p>
      <form action={action} className="mt-8 space-y-8">
        <section className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <h2 className="font-serif text-2xl">{fr ? "Informations générales" : "General information"}</h2>
          </div>
          <FormField label={fr ? "Identifiant URL" : "URL slug"} name="slug" defaultValue={entry?.slug}
            hint={fr ? "Minuscules, chiffres et tirets." : "Lowercase letters, numbers and hyphens."} required />
          <FormField label={fr ? "Ordre d’affichage" : "Display order"} name="sort_order" defaultValue={entry?.sort_order ?? 0} />
          <FormField label={fr ? "Code de rubrique" : "Section code"} name="category_code" defaultValue={entry?.category_code} />
          <FormField label={fr ? "Étiquettes" : "Tags"} name="tags" defaultValue={entry?.tags.join(", ")}
            hint={fr ? "Séparez les étiquettes par des virgules." : "Separate tags with commas."} />
          <FormField label={fr ? "Chemin de l’image" : "Image path"} name="cover_path" defaultValue={entry?.cover_path}
            hint={fr ? "Utilisez une image locale ou une image envoyée ci-dessous." : "Use a local image or upload one below."} />
          <label className="block space-y-2 text-sm font-medium">
            <span>{fr ? "Envoyer une image" : "Upload image"}</span>
            <Input name="cover_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
            <span className="block text-xs font-normal text-muted-foreground">{fr ? "4 Mo maximum. Remplace l’image actuelle." : "4 MB maximum. Replaces the current image."}</span>
          </label>
          <label className="block space-y-2 text-sm font-medium sm:col-span-2">
            <span>{fr ? "Images de galerie" : "Gallery images"}</span>
            <Textarea name="gallery_paths" rows={3} defaultValue={entry?.gallery_paths.join("\n")}
              placeholder={fr ? "Un chemin par ligne" : "One path per line"} />
          </label>
          <FormField label={fr ? "Lien externe" : "External link"} name="external_url" defaultValue={entry?.external_url} />
          <label className="flex items-center gap-3 text-sm font-medium">
            <input name="featured" type="checkbox" defaultChecked={entry?.featured} className="size-4" />
            {fr ? "Mettre en avant" : "Feature this item"}
          </label>
        </section>
        {(["fr", "en"] as const).map((language) => {
          const item = translations[language];
          return (
            <section key={language} className="space-y-5 rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-2xl">{language === "fr" ? "Français" : "English"}</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label={fr ? "Titre" : "Title"} name={`title_${language}`} defaultValue={item?.title} />
                <label className="block space-y-2 text-sm font-medium">
                  <span>{fr ? "État" : "Status"}</span>
                  <select name={`state_${language}`} defaultValue={item?.state ?? "draft"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3">
                    <option value="draft">{fr ? "Brouillon" : "Draft"}</option>
                    <option value="published">{fr ? "Publié" : "Published"}</option>
                  </select>
                </label>
                <FormField label={fr ? "Libellé de rubrique" : "Section label"}
                  name={`category_label_${language}`} defaultValue={item?.category_label} />
                <FormField label={fr ? "État du projet" : "Project status"}
                  name={`project_status_${language}`} defaultValue={item?.project_status} />
                <FormField label={fr ? "Texte alternatif de l’image" : "Image alt text"}
                  name={`cover_alt_${language}`} defaultValue={item?.cover_alt} />
                <FormField label={fr ? "Titre SEO" : "SEO title"}
                  name={`seo_title_${language}`} defaultValue={item?.seo_title} />
              </div>
              <label className="block space-y-2 text-sm font-medium">
                <span>{fr ? "Résumé" : "Summary"}</span>
                <Textarea name={`summary_${language}`} rows={3} defaultValue={item?.summary} />
              </label>
              <label className="block space-y-2 text-sm font-medium">
                <span>{fr ? "Corps du texte" : "Body"}</span>
                <Textarea name={`body_${language}`} rows={12} defaultValue={item?.body} />
              </label>
              <label className="block space-y-2 text-sm font-medium">
                <span>{fr ? "Description SEO" : "SEO description"}</span>
                <Textarea name={`seo_description_${language}`} rows={2} defaultValue={item?.seo_description ?? ""} />
              </label>
            </section>
          );
        })}
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending}>{fr ? "Enregistrer le contenu" : "Save content"}</Button>
      </form>
      {entry && (
        <form action={deleteContent.bind(null, locale, section, entry.id)} className="mt-8 border-t border-border pt-6">
          <button type="submit" className="text-sm text-destructive hover:underline"
            onClick={(event) => {
              if (!window.confirm(fr ? "Supprimer ce contenu et ses traductions ?" : "Delete this content and its translations?")) event.preventDefault();
            }}>
            {fr ? "Supprimer le contenu" : "Delete content"}
          </button>
        </form>
      )}
    </div>
  );
}
