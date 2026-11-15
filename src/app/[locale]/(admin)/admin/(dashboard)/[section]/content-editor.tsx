"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ImagePlus, Link2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database";
import { deleteContent, saveContent, type ContentFormState } from "../content-actions";
import { getEmbeddedMedia } from "@/lib/media";

type Entry = Database["public"]["Tables"]["entries"]["Row"];
type Translation = Database["public"]["Tables"]["entry_translations"]["Row"];
type Content = Entry & { entry_translations: Translation[] };
const initial: ContentFormState = { error: null };

function Field({ label, name, value, hint, type = "text" }: {
  label: string; name: string; value?: string | number | null; hint?: string; type?: string;
}) {
  return <label className="editor-field"><span>{label}</span>
    <Input name={name} type={type} defaultValue={value ?? ""} />
    {hint && <small>{hint}</small>}
  </label>;
}

export function ContentEditor({ locale, section, entry }: {
  locale: string; section: string; sectionTitle: string; entry?: Content | null;
}) {
  const [state, action, pending] = useActionState(saveContent.bind(null, locale, section, entry?.id ?? null), initial);
  const fr = locale === "fr";
  const article = section === "articles";
  const project = section === "projets";
  const simple = article || project;
  const primary = fr ? "fr" : "en";
  const secondary = fr ? "en" : "fr";
  const translations = Object.fromEntries((entry?.entry_translations ?? []).map((item) => [item.locale, item]));
  const secondaryExists = Boolean(translations[secondary]?.title);
  const secondaryGenerated = translations[secondary]?.generated_from_locale === primary;
  const autoTranslateAvailable = simple && (!translations[secondary]?.title ||
    secondaryGenerated);
  const [preview, setPreview] = useState(entry?.cover_path ?? "");
  const [title, setTitle] = useState(translations[primary]?.title ?? "");
  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  function languageFields(language: "fr" | "en", optional = false) {
    const item = translations[language];
    return <div className="editor-fields">
      <label className="editor-field"><span>{fr ? "Titre" : "Title"}</span>
        <Input name={`title_${language}`} defaultValue={item?.title ?? ""} maxLength={240}
          required={!optional} onChange={language === primary ? (e) => setTitle(e.target.value) : undefined}
          placeholder={article ? (fr ? "Titre de l’article" : "Article title") : (fr ? "Nom du projet" : "Project name")} />
      </label>
      <label className="editor-field"><span>{fr ? "Résumé" : "Summary"}</span>
        <Textarea name={`summary_${language}`} rows={3} defaultValue={item?.summary ?? ""}
          placeholder={fr ? "Une ou deux phrases pour présenter le contenu" : "One or two sentences introducing this content"} />
      </label>
      <label className="editor-field"><span>{article ? (fr ? "Article" : "Article") : (fr ? "Description" : "Description")}</span>
        <Textarea name={`body_${language}`} rows={optional ? 8 : 16} defaultValue={item?.body ?? ""}
          placeholder={fr ? "Écrivez ici. Séparez les paragraphes par une ligne vide." : "Write here. Separate paragraphs with an empty line."} />
        {article && <small>{fr ? "Pour un intertitre, commencez une ligne par ##." : "Start a line with ## for a subheading."}</small>}
      </label>
      {project && <Field label={fr ? "Avancement" : "Progress"} name={`project_status_${language}`}
        value={item?.project_status} hint={fr ? "Ex. : en cours, terminé" : "For example: in progress, completed"} />}
      <label className="editor-field"><span>{fr ? "Visibilité" : "Visibility"}</span>
        <select name={`state_${language}`} defaultValue={item?.state ?? "draft"}>
          <option value="draft">{fr ? "Brouillon" : "Draft"}</option>
          <option value="published">{fr ? "Publier sur le site" : "Publish on the site"}</option>
        </select>
        <small>{language === secondary && autoTranslateAvailable
          ? (fr ? "La traduction automatique suit la visibilité de l’original." : "Automatic translation follows the original visibility.")
          : (fr ? "La publication concerne seulement cette langue." : "Publication applies only to this language.")}</small>
      </label>
    </div>;
  }

  return <div className="editor-page">
    <Link href={`/${locale}/admin/${section}`} className="editor-back">← {fr ? "Voir la liste" : "View list"}</Link>
    <div className="editor-heading">
      <h1>{entry ? (fr ? "Modifier" : "Edit") : (fr ? "Créer" : "Create")} {article ? (fr ? "un article" : "an article") : project ? (fr ? "un projet" : "a project") : (fr ? "un contenu" : "content")}</h1>
      <p>{autoTranslateAvailable
        ? (fr ? "Rédigez en français. La version anglaise sera créée automatiquement."
          : "Write in English. The French version will be created automatically.")
        : (fr ? "Écrivez, ajoutez une image, puis choisissez la visibilité."
          : "Write, add an image, then choose visibility.")}</p>
    </div>
    <form action={action} className="editor-layout">
      <div className="editor-main">
        <section className="editor-panel">
          <div className="editor-panel-heading"><span className="editor-step">01</span><h2>{simple
            ? (article
              ? (fr ? "Votre article en français" : "Your post in English")
              : (fr ? "Votre projet en français" : "Your project in English"))
            : (fr ? "Votre contenu" : "Your content")}</h2></div>
          {languageFields(primary)}
          {autoTranslateAvailable && <label className="editor-translation-toggle">
            <input name="auto_translate" type="checkbox" defaultChecked />
            <span><strong>{fr ? "Traduire automatiquement en anglais" : "Translate automatically into French"}</strong>
              <small>{fr ? "La traduction suit votre texte et sa visibilité." : "The translation follows your text and its visibility."}</small>
            </span>
          </label>}
        </section>
        <section className="editor-panel">
          <div className="editor-panel-heading"><span className="editor-step">02</span><h2>{fr ? "Image et vidéo" : "Image and video"}</h2></div>
          {preview && <div className="editor-cover-preview"><Image src={preview} alt="" fill unoptimized sizes="(max-width: 900px) 100vw, 640px" /></div>}
          <label className="editor-upload"><ImagePlus size={22} aria-hidden="true" />
            <span>{preview ? (fr ? "Changer l’image" : "Change image") : (fr ? "Ajouter une image" : "Add an image")}</span>
            <small>{fr ? "JPEG, PNG, WebP ou AVIF · 4 Mo maximum" : "JPEG, PNG, WebP or AVIF · 4 MB maximum"}</small>
            <input name="cover_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => { const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} />
          </label>
          {simple && <label className="editor-field editor-media-link"><span><Link2 size={17} aria-hidden="true" /> {fr ? "Lien vidéo" : "Video link"}</span>
            <Input name="media_url" type="url" defaultValue={getEmbeddedMedia(entry?.external_url) ? entry?.external_url ?? "" : ""} placeholder="https://www.youtube.com/watch?v=…" />
            <small>{fr ? "YouTube, Instagram ou TikTok. La vidéo apparaît sur la page." : "YouTube, Instagram or TikTok. The video appears on the page."}</small>
          </label>}
        </section>
        <details className="editor-panel editor-disclosure" open={!simple}>
          <summary><Settings2 size={18} aria-hidden="true" /> {fr ? "Autres options" : "Other options"}</summary>
          <div className="editor-options">
            <Field label={fr ? "Adresse de la page" : "Page address"} name="slug" value={entry?.slug}
              hint={fr ? "Créée automatiquement à partir du titre si ce champ est vide." : "Created from the title if left empty."} />
            <div className="editor-two-columns">
              <Field label={fr ? "Rubrique" : "Section"} name={`category_label_${primary}`} value={translations[primary]?.category_label} />
              <Field label={fr ? "Mots-clés" : "Keywords"} name="tags" value={entry?.tags.join(", ")}
                hint={fr ? "Séparez-les par une virgule." : "Separate with a comma."} />
            </div>
            <Field label={fr ? "Description de l’image" : "Image description"} name={`cover_alt_${primary}`} value={translations[primary]?.cover_alt} />
            <label className="editor-check"><input name="featured" type="checkbox" defaultChecked={entry?.featured} />
              {fr ? "Mettre en avant sur le site" : "Feature on the site"}</label>
            {project && <><Field label={fr ? "Lien du projet" : "Project link"} name="external_url" value={getEmbeddedMedia(entry?.external_url) ? "" : entry?.external_url} type="url"
              hint={fr ? "Utilisez soit un lien de projet, soit une vidéo." : "Use either a project link or a video."} />
              <label className="editor-field"><span>{fr ? "Images de galerie" : "Gallery images"}</span>
                <Textarea name="gallery_paths" rows={3} defaultValue={entry?.gallery_paths.join("\n") ?? ""} />
              </label></>}
            {!simple && <><Field label={fr ? "Ordre d’affichage" : "Display order"} name="sort_order" value={entry?.sort_order ?? 0} />
              <Field label={fr ? "Code de rubrique" : "Section code"} name="category_code" value={entry?.category_code} />
              <Field label={fr ? "Chemin de l’image" : "Image path"} name="cover_path" value={entry?.cover_path} />
              <Field label={fr ? "Lien externe" : "External link"} name="external_url" value={entry?.external_url} /></>}
          </div>
        </details>
        <details className="editor-panel editor-disclosure">
          <summary>
            <span>{fr ? "Traduction anglaise" : "French translation"}</span>
            <small className="editor-translation-status">{secondaryGenerated
              ? (fr ? "Automatique" : "Automatic")
              : secondaryExists ? (fr ? "Personnalisée" : "Custom")
                : (fr ? "Facultative" : "Optional")}</small>
          </summary>
          <p className="editor-secondary-hint">{secondaryGenerated
            ? (fr ? "Vous pouvez corriger cette version. Vos corrections seront conservées."
              : "You can edit this version. Your changes will be kept.")
            : secondaryExists
              ? (fr ? "Cette version est indépendante. Elle ne sera pas remplacée."
                : "This version is independent. It will not be replaced.")
              : (fr ? "Laissez vide pour utiliser la traduction automatique."
                : "Leave this blank to use automatic translation.")}</p>
          {languageFields(secondary, true)}
        </details>
      </div>
      <aside className="editor-side"><div className="editor-side-card">
        <p className="editor-side-label">{fr ? "Aperçu" : "Preview"}</p>
        {preview && <div className="editor-side-image"><Image src={preview} alt="" fill unoptimized sizes="260px" /></div>}
        <strong>{title || (fr ? "Votre titre apparaîtra ici" : "Your title will appear here")}</strong>
        <p>{fr ? "Choisissez « Publier sur le site » pour rendre le contenu visible." : "Choose “Publish on the site” to make it visible."}</p>
        {state.error && <p role="alert" className="editor-error">{state.error}</p>}
        <Button type="submit" disabled={pending} className="editor-save">
          {pending ? (fr ? "Enregistrer…" : "Saving…") : entry ? (fr ? "Enregistrer les modifications" : "Save changes") : (fr ? "Enregistrer le contenu" : "Save content")}
        </Button>
      </div></aside>
    </form>
    {entry && <form action={deleteContent.bind(null, locale, section, entry.id)} className="editor-delete">
      <button type="submit" onClick={(event) => {
        if (!window.confirm(fr ? "Supprimer ce contenu et ses traductions ?" : "Delete this content and its translations?")) event.preventDefault();
      }}>{fr ? "Supprimer le contenu" : "Delete content"}</button>
    </form>}
  </div>;
}
