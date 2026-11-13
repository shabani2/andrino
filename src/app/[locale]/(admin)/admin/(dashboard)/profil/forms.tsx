"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { KeyRound, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword, saveProfile, type ProfileState } from "./actions";

const initial: ProfileState = { error: null, success: null };

type ProfileProps = {
  locale: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  avatarPath: string | null;
  role: string;
};

function ProfileEditForm({ locale, displayName, phone, onSuccess, onCancel }: {
  locale: string;
  displayName: string | null;
  phone: string | null;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState(saveProfile.bind(null, locale), initial);
  const fr = locale === "fr";

  useEffect(() => {
    if (state.success) onSuccess(state.success);
  }, [state.success, onSuccess]);

  return (
    <form action={action} className="admin-profile-dialog-form">
      <label className="admin-profile-field">
        <span>{fr ? "Nom affiché" : "Display name"}</span>
        <Input name="display_name" defaultValue={displayName ?? ""} maxLength={120} />
      </label>
      <label className="admin-profile-field">
        <span>{fr ? "Téléphone" : "Phone"}</span>
        <Input name="phone" type="tel" defaultValue={phone ?? ""} maxLength={32} />
      </label>
      <label className="admin-profile-field">
        <span>{fr ? "Photo de profil" : "Profile photo"}</span>
        <Input name="avatar_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" />
        <small>{fr ? "JPEG, PNG, WebP ou AVIF. 4 Mo maximum." : "JPEG, PNG, WebP or AVIF. 4 MB maximum."}</small>
      </label>
      {state.error && <p role="alert" className="admin-profile-error">{state.error}</p>}
      <div className="admin-profile-dialog-actions">
        <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
          {fr ? "Annuler" : "Cancel"}
        </Button>
        <Button type="submit" disabled={pending}>
          {fr ? "Enregistrer le profil" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

function PasswordForm({ locale, email, onSuccess, onCancel }: {
  locale: string;
  email: string;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState(changePassword.bind(null, locale), initial);
  const fr = locale === "fr";

  useEffect(() => {
    if (state.success) onSuccess(state.success);
  }, [state.success, onSuccess]);

  return (
    <form action={action} className="admin-profile-dialog-form">
      <input type="email" name="email" autoComplete="username" value={email}
        readOnly tabIndex={-1} className="sr-only" aria-hidden="true" />
      <label className="admin-profile-field">
        <span>{fr ? "Mot de passe actuel" : "Current password"}</span>
        <Input name="current_password" type="password" autoComplete="current-password" required />
      </label>
      <label className="admin-profile-field">
        <span>{fr ? "Nouveau mot de passe" : "New password"}</span>
        <Input name="new_password" type="password" autoComplete="new-password" minLength={12} required />
      </label>
      <label className="admin-profile-field">
        <span>{fr ? "Confirmer le mot de passe" : "Confirm password"}</span>
        <Input name="confirm_password" type="password" autoComplete="new-password" minLength={12} required />
      </label>
      {state.error && <p role="alert" className="admin-profile-error">{state.error}</p>}
      <div className="admin-profile-dialog-actions">
        <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
          {fr ? "Annuler" : "Cancel"}
        </Button>
        <Button type="submit" disabled={pending}>
          {fr ? "Changer le mot de passe" : "Change password"}
        </Button>
      </div>
    </form>
  );
}

export function ProfileForms({ locale, email, displayName, phone, avatarPath, role }: ProfileProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();
  const fr = locale === "fr";
  const accountName = displayName || email.split("@")[0];

  const profileSaved = useCallback((message: string) => {
    setNotice(message);
    setProfileOpen(false);
    router.refresh();
  }, [router]);
  const passwordSaved = useCallback((message: string) => {
    setNotice(message);
    setPasswordOpen(false);
  }, []);

  return (
    <div className="admin-profile-sections">
      {notice && <p role="status" className="admin-profile-notice">{notice}</p>}

      <section className="admin-profile-panel" aria-labelledby="admin-profile-details-title">
        <div className="admin-profile-identity">
          <span className="admin-profile-avatar" aria-hidden="true">
            {avatarPath
              ? <Image src={avatarPath} alt="" width={72} height={72} className="admin-profile-avatar-image" />
              : accountName.trim().charAt(0).toUpperCase() || "A"}
          </span>
          <div className="admin-profile-identity-copy">
            <h2 id="admin-profile-details-title">{accountName}</h2>
            <p>{email}</p>
            <small>{role === "admin" ? (fr ? "Administrateur" : "Administrator") : (fr ? "Éditeur" : "Editor")}</small>
          </div>
        </div>
        <dl className="admin-profile-details">
          <div><dt>{fr ? "Nom affiché" : "Display name"}</dt><dd>{displayName || (fr ? "Non renseigné" : "Not provided")}</dd></div>
          <div><dt>{fr ? "Adresse e-mail" : "Email address"}</dt><dd>{email}</dd></div>
          <div><dt>{fr ? "Téléphone" : "Phone"}</dt><dd>{phone || (fr ? "Non renseigné" : "Not provided")}</dd></div>
        </dl>
        <Dialog.Root open={profileOpen} onOpenChange={setProfileOpen}>
          <Dialog.Trigger asChild>
            <Button type="button" variant="outline" className="admin-profile-edit-trigger" onClick={() => setNotice(null)}>
              <Pencil size={16} aria-hidden="true" /> {fr ? "Modifier le profil" : "Edit profile"}
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="admin-profile-dialog-overlay" />
            <Dialog.Content className="admin-profile-dialog">
              <div className="admin-profile-dialog-heading">
                <Dialog.Title>{fr ? "Modifier le profil" : "Edit profile"}</Dialog.Title>
                <Dialog.Close className="admin-profile-dialog-close" aria-label={fr ? "Fermer la fenêtre" : "Close dialog"}>
                  <X size={20} aria-hidden="true" />
                </Dialog.Close>
              </div>
              <Dialog.Description>{fr ? "Modifiez votre nom, votre téléphone et votre photo." : "Edit your name, phone number and photo."}</Dialog.Description>
              {profileOpen && <ProfileEditForm locale={locale} displayName={displayName} phone={phone}
                onSuccess={profileSaved} onCancel={() => setProfileOpen(false)} />}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      <section className="admin-profile-panel admin-profile-security" aria-labelledby="admin-profile-security-title">
        <div className="admin-profile-security-copy">
          <span className="admin-profile-security-icon"><KeyRound size={20} aria-hidden="true" /></span>
          <div>
            <h2 id="admin-profile-security-title">{fr ? "Mot de passe" : "Password"}</h2>
            <p>{fr ? "Choisissez un mot de passe d’au moins 12 caractères." : "Choose a password with at least 12 characters."}</p>
          </div>
        </div>
        <Dialog.Root open={passwordOpen} onOpenChange={setPasswordOpen}>
          <Dialog.Trigger asChild>
            <Button type="button" variant="outline" onClick={() => setNotice(null)}>
              {fr ? "Changer le mot de passe" : "Change password"}
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="admin-profile-dialog-overlay" />
            <Dialog.Content className="admin-profile-dialog">
              <div className="admin-profile-dialog-heading">
                <Dialog.Title>{fr ? "Changer le mot de passe" : "Change password"}</Dialog.Title>
                <Dialog.Close className="admin-profile-dialog-close" aria-label={fr ? "Fermer la fenêtre" : "Close dialog"}>
                  <X size={20} aria-hidden="true" />
                </Dialog.Close>
              </div>
              <Dialog.Description>
                {fr ? "Saisissez votre mot de passe actuel et le nouveau." : "Enter your current and new passwords."}
              </Dialog.Description>
              {passwordOpen && <PasswordForm locale={locale} email={email}
                onSuccess={passwordSaved} onCancel={() => setPasswordOpen(false)} />}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
    </div>
  );
}
