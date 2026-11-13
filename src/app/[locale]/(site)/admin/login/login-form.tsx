"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: LoginState = { error: null };

export function LoginForm({ locale }: { locale: string }) {
  const [state, action, pending] = useActionState(signIn.bind(null, locale), initialState);
  const fr = locale === "fr";

  return (
    <form action={action} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="admin-email" className="block text-sm font-medium">
          {fr ? "Adresse e-mail" : "Email address"}
        </label>
        <Input id="admin-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      </div>
      <div className="space-y-2">
        <label htmlFor="admin-password" className="block text-sm font-medium">
          {fr ? "Mot de passe" : "Password"}
        </label>
        <Input id="admin-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {fr ? "Se connecter" : "Sign in"}
      </Button>
    </form>
  );
}
