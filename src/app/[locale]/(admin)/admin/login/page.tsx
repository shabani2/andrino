import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { adminSessionClient } from "@/lib/admin-session";
import { LoginForm } from "./login-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: locale === "fr" ? "Connexion équipe" : "Team sign in", robots: { index: false, follow: false } };
}

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await adminSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const staff = await supabase.from("staff_members")
      .select("role,active").eq("user_id", user.id).maybeSingle();
    if (staff.data?.active) redirect(`/${locale}/admin`);
  }

  const fr = locale === "fr";
  return (
    <div className="admin-login">
      <header className="admin-login-header">
        <Link href={`/${locale}`} className="admin-login-brand">ANDRINO</Link>
        <Link href={`/${locale}`} className="admin-login-site-link">
          {fr ? "Voir le site" : "View site"} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </header>
      <main id="main-content" className="admin-login-main" aria-labelledby="admin-login-title">
        <div className="admin-login-card">
          <p className="admin-login-kicker">{fr ? "Espace de gestion" : "Management workspace"}</p>
          <h1 id="admin-login-title" className="mt-3 font-serif">
            {fr ? "Connexion équipe" : "Team sign in"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {fr ? "Connectez-vous avec votre compte d’équipe." : "Sign in with your team account."}
          </p>
          <LoginForm locale={locale} />
        </div>
      </main>
    </div>
  );
}
