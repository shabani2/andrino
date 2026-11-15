"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMember, deleteMember, linkMember, updateMember, type TeamState } from "./actions";

const initial: TeamState = { error: null, success: null };

function Feedback({ state }: { state: TeamState }) {
  return <>{state.error && <p role="alert" className="admin-profile-error">{state.error}</p>}
    {state.success && <p role="status" className="admin-profile-notice">{state.success}</p>}</>;
}

function RoleSelect({ defaultValue = "editor", fr }: { defaultValue?: string; fr: boolean }) {
  return <label className="admin-profile-field"><span>{fr ? "Rôle" : "Role"}</span>
    <select name="role" defaultValue={defaultValue} className="h-10 w-full rounded-md border border-input bg-background px-3">
      <option value="editor">{fr ? "Éditeur" : "Editor"}</option>
      <option value="admin">{fr ? "Administrateur" : "Administrator"}</option>
    </select>
  </label>;
}

function ProfileFields({ fr, name, phone, email }: { fr: boolean; name?: string | null; phone?: string | null; email?: string }) {
  return <>
    <label className="admin-profile-field"><span>{fr ? "Nom affiché" : "Display name"}</span><Input name="display_name" defaultValue={name ?? ""} maxLength={120} /></label>
    <label className="admin-profile-field"><span>{fr ? "Adresse e-mail" : "Email address"}</span><Input name="email" type="email" defaultValue={email ?? ""} autoComplete="off" required /></label>
    <label className="admin-profile-field"><span>{fr ? "Téléphone" : "Phone"}</span><Input name="phone" type="tel" defaultValue={phone ?? ""} maxLength={32} /></label>
    <label className="admin-profile-field"><span>{fr ? "Photo de profil" : "Profile photo"}</span>
      <Input name="avatar_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
      <small>{fr ? "JPEG, PNG, WebP ou AVIF. 4 Mo maximum." : "JPEG, PNG, WebP or AVIF. 4 MB maximum."}</small>
    </label>
  </>;
}

function DialogFrame({ children, title, description, fr }: { children: React.ReactNode; title: string; description: string; fr: boolean }) {
  return <Dialog.Portal><Dialog.Overlay className="admin-profile-dialog-overlay" />
    <Dialog.Content className="admin-profile-dialog">
      <div className="admin-profile-dialog-heading"><Dialog.Title>{title}</Dialog.Title>
        <Dialog.Close className="admin-profile-dialog-close" aria-label={fr ? "Fermer la fenêtre" : "Close dialog"}><X size={20} aria-hidden="true" /></Dialog.Close>
      </div>
      <Dialog.Description>{description}</Dialog.Description>{children}
    </Dialog.Content>
  </Dialog.Portal>;
}

export function CreateMemberDialog({ locale }: { locale: string }) {
  const fr = locale === "fr";
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "link">("create");
  const [created, createAction, creating] = useActionState(createMember.bind(null, locale), initial);
  const [linked, linkAction, linking] = useActionState(linkMember.bind(null, locale), initial);
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild><Button type="button"><Plus size={16} aria-hidden="true" />{fr ? "Ajouter un membre" : "Add member"}</Button></Dialog.Trigger>
    <DialogFrame title={fr ? "Ajouter un membre" : "Add a member"}
      description={fr ? "Créez un compte ou ajoutez un compte existant." : "Create an account or add an existing one."} fr={fr}>
      <div className="team-dialog-tabs" role="tablist" aria-label={fr ? "Type de compte" : "Account type"}>
        <button type="button" role="tab" aria-selected={mode === "create"} className={mode === "create" ? "is-active" : ""} onClick={() => setMode("create")}>{fr ? "Créer un compte" : "Create account"}</button>
        <button type="button" role="tab" aria-selected={mode === "link"} className={mode === "link" ? "is-active" : ""} onClick={() => setMode("link")}>{fr ? "Compte existant" : "Existing account"}</button>
      </div>
      {mode === "create" ? <form action={createAction} className="admin-profile-dialog-form">
        <ProfileFields fr={fr} />
        <label className="admin-profile-field"><span>{fr ? "Mot de passe initial" : "Initial password"}</span><Input name="password" type="password" autoComplete="new-password" minLength={12} required /></label>
        <label className="admin-profile-field"><span>{fr ? "Confirmer le mot de passe" : "Confirm password"}</span><Input name="password_confirmation" type="password" autoComplete="new-password" minLength={12} required /></label>
        <RoleSelect fr={fr} /><Feedback state={created} />
        <div className="admin-profile-dialog-actions"><Button type="submit" disabled={creating}>{fr ? "Créer le compte" : "Create account"}</Button></div>
      </form> : <form action={linkAction} className="admin-profile-dialog-form">
        <label className="admin-profile-field"><span>{fr ? "Adresse e-mail" : "Email address"}</span><Input name="email" type="email" autoComplete="off" required /></label>
        <RoleSelect fr={fr} /><Feedback state={linked} />
        <div className="admin-profile-dialog-actions"><Button type="submit" disabled={linking}>{fr ? "Ajouter le compte" : "Add account"}</Button></div>
      </form>}
    </DialogFrame>
  </Dialog.Root>;
}

type MemberControlsProps = { locale: string; userId: string; role: string; active: boolean; self: boolean; name: string | null; phone: string | null; email: string };

export function MemberControls({ locale, userId, role, active, self, name, phone, email }: MemberControlsProps) {
  const fr = locale === "fr";
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [edited, editAction, editing] = useActionState(updateMember.bind(null, locale, userId), initial);
  const [deleted, deleteAction, deleting] = useActionState(deleteMember.bind(null, locale, userId), initial);

  if (self) return <Link href={`/${locale}/admin/profil`} className="team-self-link">{fr ? "Modifier mon profil" : "Edit my profile"}</Link>;

  return <div className="team-member-actions">
    <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
      <Dialog.Trigger asChild><Button type="button" variant="outline" size="sm"><Pencil size={15} aria-hidden="true" />{fr ? "Modifier" : "Edit"}</Button></Dialog.Trigger>
      <DialogFrame title={fr ? "Modifier le membre" : "Edit member"} description={fr ? "Mettez à jour ses coordonnées et ses accès." : "Update contact details and access."} fr={fr}>
        <form action={editAction} className="admin-profile-dialog-form"><ProfileFields fr={fr} name={name} phone={phone} email={email} />
          <RoleSelect fr={fr} defaultValue={role} /><label className="team-active-toggle"><input name="active" type="checkbox" defaultChecked={active} />{fr ? "Compte actif" : "Active account"}</label>
          <Feedback state={edited} /><div className="admin-profile-dialog-actions"><Button type="submit" disabled={editing}>{fr ? "Enregistrer le membre" : "Save member"}</Button></div>
        </form>
      </DialogFrame>
    </Dialog.Root>
    <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
      <Dialog.Trigger asChild><Button type="button" variant="ghost" size="sm" className="team-delete-trigger"><Trash2 size={15} aria-hidden="true" />{fr ? "Supprimer" : "Delete"}</Button></Dialog.Trigger>
      <DialogFrame title={fr ? "Supprimer ce compte" : "Delete this account"} description={fr ? "Cette action supprime l’accès et ne peut pas être annulée." : "This removes access and cannot be undone."} fr={fr}>
        <form action={deleteAction} className="admin-profile-dialog-form"><Feedback state={deleted} />
          <div className="admin-profile-dialog-actions"><Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>{fr ? "Annuler" : "Cancel"}</Button>
            <Button type="submit" disabled={deleting} className="team-delete-button"><Trash2 size={15} aria-hidden="true" />{fr ? "Supprimer le compte" : "Delete account"}</Button></div>
        </form>
      </DialogFrame>
    </Dialog.Root>
  </div>;
}
