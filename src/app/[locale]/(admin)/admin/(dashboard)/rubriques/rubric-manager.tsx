"use client";

import { useActionState, useState } from "react";
import { Dialog } from "radix-ui";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteRubric, saveRubric, type RubricState } from "./actions";

export type Rubric = { id: string; slug: string; fr: { title: string; summary: string }; en: { title: string; summary: string } };
const initial: RubricState = { error: null, success: null };

function Feedback({ state }: { state: RubricState }) {
  return <>{state.error && <p role="alert" className="admin-profile-error">{state.error}</p>}
    {state.success && <p role="status" className="admin-profile-notice">{state.success}</p>}</>;
}

function RubricDialog({ locale, rubric, trigger }: { locale: string; rubric?: Rubric; trigger: React.ReactNode }) {
  const fr = locale === "fr";
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(saveRubric.bind(null, locale, rubric?.id ?? null), initial);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="admin-profile-dialog-overlay" />
      <Dialog.Content className="admin-profile-dialog">
        <div className="admin-profile-dialog-heading"><Dialog.Title>{rubric ? (fr ? "Modifier la rubrique" : "Edit category") : (fr ? "Créer une rubrique" : "Create category")}</Dialog.Title>
          <Dialog.Close className="admin-profile-dialog-close" aria-label={fr ? "Fermer la fenêtre" : "Close dialog"}><X size={20} aria-hidden="true" /></Dialog.Close></div>
        <Dialog.Description>{fr ? "Les deux langues sont publiées ensemble." : "Both languages are published together."}</Dialog.Description>
        <form action={action} className="admin-profile-dialog-form">
          <label className="admin-profile-field"><span>Nom en français</span><Input name="title_fr" defaultValue={rubric?.fr.title ?? ""} maxLength={240} required /></label>
          <label className="admin-profile-field"><span>Description en français</span><Textarea name="summary_fr" defaultValue={rubric?.fr.summary ?? ""} rows={3} maxLength={2000} /></label>
          <label className="admin-profile-field"><span>English name</span><Input name="title_en" defaultValue={rubric?.en.title ?? ""} maxLength={240} required /></label>
          <label className="admin-profile-field"><span>English description</span><Textarea name="summary_en" defaultValue={rubric?.en.summary ?? ""} rows={3} maxLength={2000} /></label>
          <label className="admin-profile-field"><span>{fr ? "Adresse de la rubrique" : "Category address"}</span><Input name="slug" defaultValue={rubric?.slug ?? ""} maxLength={120} /><small>{fr ? "Créée à partir du nom si ce champ est vide." : "Created from the name if left blank."}</small></label>
          <Feedback state={state} /><div className="admin-profile-dialog-actions"><Button type="submit" disabled={pending}>{rubric ? (fr ? "Enregistrer la rubrique" : "Save category") : (fr ? "Créer la rubrique" : "Create category")}</Button></div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}

function DeleteRubric({ locale, rubric }: { locale: string; rubric: Rubric }) {
  const fr = locale === "fr";
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteRubric.bind(null, locale, rubric.id), initial);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild><Button type="button" variant="ghost" size="sm" className="team-delete-trigger"><Trash2 size={15} aria-hidden="true" />{fr ? "Supprimer" : "Delete"}</Button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="admin-profile-dialog-overlay" /><Dialog.Content className="admin-profile-dialog">
      <div className="admin-profile-dialog-heading"><Dialog.Title>{fr ? "Supprimer la rubrique" : "Delete category"}</Dialog.Title><Dialog.Close className="admin-profile-dialog-close" aria-label={fr ? "Fermer la fenêtre" : "Close dialog"}><X size={20} aria-hidden="true" /></Dialog.Close></div>
      <Dialog.Description>{fr ? "Cette action ne peut pas être annulée." : "This action cannot be undone."}</Dialog.Description>
      <form action={action} className="admin-profile-dialog-form"><Feedback state={state} /><div className="admin-profile-dialog-actions"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={pending}>{fr ? "Annuler" : "Cancel"}</Button><Button type="submit" disabled={pending} className="team-delete-button">{fr ? "Supprimer la rubrique" : "Delete category"}</Button></div></form>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}

export function RubricManager({ locale, rubrics }: { locale: string; rubrics: Rubric[] }) {
  const fr = locale === "fr";
  return <div className="rubric-page"><div className="team-heading"><div><p className="text-sm text-muted-foreground">{fr ? "Organisation" : "Organization"}</p><h1 className="mt-2 font-serif text-4xl">{fr ? "Rubriques" : "Categories"}</h1></div>
    <RubricDialog locale={locale} trigger={<Button type="button"><Plus size={16} aria-hidden="true" />{fr ? "Créer une rubrique" : "Create category"}</Button>} /></div>
    {rubrics.length === 0 ? <p className="admin-empty mt-8">{fr ? "Aucune rubrique. Créez la première." : "No categories yet. Create the first one."}</p>
      : <div className="rubric-list">{rubrics.map((rubric) => <article key={rubric.id} className="rubric-row"><div><h2>{fr ? rubric.fr.title : rubric.en.title}</h2><p>{fr ? rubric.fr.summary : rubric.en.summary}</p><small>/{rubric.slug}</small></div><div className="team-member-actions"><RubricDialog locale={locale} rubric={rubric} trigger={<Button type="button" variant="outline" size="sm"><Pencil size={15} aria-hidden="true" />{fr ? "Modifier" : "Edit"}</Button>} /><DeleteRubric locale={locale} rubric={rubric} /></div></article>)}</div>}
  </div>;
}
