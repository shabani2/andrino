"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword, saveProfile, type ProfileState } from "./actions";

const initial: ProfileState = { error: null, success: null };

export function ProfileForms({ locale, email, displayName, phone }: {
  locale: string; email: string; displayName: string | null; phone: string | null;
}) {
  const [profile, profileAction, profilePending] = useActionState(saveProfile.bind(null, locale), initial);
  const [password, passwordAction, passwordPending] = useActionState(changePassword.bind(null, locale), initial);
  const fr = locale === "fr";

  return (
    <div className="mt-8 space-y-8">
      <form action={profileAction} className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">{fr ? "Informations du profil" : "Profile details"}</h2>
        <label className="block space-y-2 text-sm font-medium">
          <span>{fr ? "Nom affiché" : "Display name"}</span>
          <Input name="display_name" defaultValue={displayName ?? ""} maxLength={120} />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{fr ? "Téléphone" : "Phone"}</span>
          <Input name="phone" type="tel" defaultValue={phone ?? ""} maxLength={32} />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{fr ? "Photo de profil" : "Profile photo"}</span>
          <Input name="avatar_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
          <span className="block text-xs font-normal text-muted-foreground">
            {fr ? "JPEG, PNG, WebP ou AVIF. 4 Mo maximum." : "JPEG, PNG, WebP or AVIF. 4 MB maximum."}
          </span>
        </label>
        {profile.error && <p role="alert" className="text-sm text-destructive">{profile.error}</p>}
        {profile.success && <p role="status" className="text-sm">{profile.success}</p>}
        <Button type="submit" disabled={profilePending}>{fr ? "Enregistrer le profil" : "Save profile"}</Button>
      </form>
      <form action={passwordAction} className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-2xl">{fr ? "Mot de passe" : "Password"}</h2>
        <input type="email" name="email" autoComplete="username" value={email}
          readOnly tabIndex={-1} className="sr-only" aria-hidden="true" />
        <label className="block space-y-2 text-sm font-medium">
          <span>{fr ? "Mot de passe actuel" : "Current password"}</span>
          <Input name="current_password" type="password" autoComplete="current-password" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{fr ? "Nouveau mot de passe" : "New password"}</span>
          <Input name="new_password" type="password" autoComplete="new-password" minLength={12} required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          <span>{fr ? "Confirmer le mot de passe" : "Confirm password"}</span>
          <Input name="confirm_password" type="password" autoComplete="new-password" minLength={12} required />
        </label>
        {password.error && <p role="alert" className="text-sm text-destructive">{password.error}</p>}
        {password.success && <p role="status" className="text-sm">{password.success}</p>}
        <Button type="submit" disabled={passwordPending}>{fr ? "Changer le mot de passe" : "Change password"}</Button>
      </form>
    </div>
  );
}
