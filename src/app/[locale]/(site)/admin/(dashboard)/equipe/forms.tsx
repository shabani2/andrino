"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMember, linkMember, updateMember, type TeamState } from "./actions";

const initial: TeamState = { error: null, success: null };

function Feedback({ state }: { state: TeamState }) {
  return <>
    {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
    {state.success && <p role="status" className="text-sm">{state.success}</p>}
  </>;
}

function RoleSelect({ defaultValue = "editor", fr }: { defaultValue?: string; fr: boolean }) {
  return <label className="block space-y-2 text-sm font-medium">
    <span>{fr ? "Rôle" : "Role"}</span>
    <select name="role" defaultValue={defaultValue} className="h-10 w-full rounded-md border border-input bg-background px-3">
      <option value="editor">{fr ? "Éditeur" : "Editor"}</option>
      <option value="admin">{fr ? "Administrateur" : "Administrator"}</option>
    </select>
  </label>;
}

export function CreateMemberForm({ locale }: { locale: string }) {
  const [state, action, pending] = useActionState(createMember.bind(null, locale), initial);
  const fr = locale === "fr";
  return <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
    <h2 className="font-serif text-2xl">{fr ? "Créer un membre" : "Create a member"}</h2>
    <label className="block space-y-2 text-sm font-medium">
      <span>{fr ? "Adresse e-mail" : "Email address"}</span>
      <Input name="email" type="email" autoComplete="off" required />
    </label>
    <label className="block space-y-2 text-sm font-medium">
      <span>{fr ? "Mot de passe initial" : "Initial password"}</span>
      <Input name="password" type="password" autoComplete="new-password" minLength={12} required />
    </label>
    <label className="block space-y-2 text-sm font-medium">
      <span>{fr ? "Confirmer le mot de passe" : "Confirm password"}</span>
      <Input name="password_confirmation" type="password" autoComplete="new-password" minLength={12} required />
    </label>
    <RoleSelect fr={fr} />
    <Feedback state={state} />
    <Button type="submit" disabled={pending}>{fr ? "Créer le membre" : "Create member"}</Button>
  </form>;
}

export function LinkMemberForm({ locale }: { locale: string }) {
  const [state, action, pending] = useActionState(linkMember.bind(null, locale), initial);
  const fr = locale === "fr";
  return <form action={action} className="space-y-4 rounded-2xl border border-border bg-card p-6">
    <h2 className="font-serif text-2xl">{fr ? "Ajouter un compte existant" : "Add an existing account"}</h2>
    <label className="block space-y-2 text-sm font-medium">
      <span>{fr ? "Adresse e-mail" : "Email address"}</span>
      <Input name="email" type="email" autoComplete="off" required />
    </label>
    <RoleSelect fr={fr} />
    <Feedback state={state} />
    <Button type="submit" disabled={pending}>{fr ? "Ajouter le membre" : "Add member"}</Button>
  </form>;
}

export function MemberControls({ locale, userId, role, active, self }: {
  locale: string; userId: string; role: string; active: boolean; self: boolean;
}) {
  const [state, action, pending] = useActionState(updateMember.bind(null, locale, userId), initial);
  const fr = locale === "fr";
  if (self) return <span className="text-xs text-muted-foreground">{fr ? "Votre compte" : "Your account"}</span>;
  return <form action={action} className="mt-4 flex flex-wrap items-end gap-3">
    <div className="min-w-40"><RoleSelect fr={fr} defaultValue={role} /></div>
    <label className="flex h-10 items-center gap-2 text-sm">
      <input name="active" type="checkbox" defaultChecked={active} className="size-4" />
      {fr ? "Actif" : "Active"}
    </label>
    <Button type="submit" size="sm" disabled={pending}>{fr ? "Enregistrer les droits" : "Save access"}</Button>
    <Feedback state={state} />
  </form>;
}
