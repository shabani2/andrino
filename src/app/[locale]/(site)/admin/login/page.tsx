import { redirect } from "next/navigation";
import { adminSessionClient } from "@/lib/admin-session";
import { LoginForm } from "./login-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: locale === "fr" ? "Connexion admin" : "Admin sign in", robots: { index: false, follow: false } };
}

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await adminSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const staff = await supabase.from("staff_members")
      .select("role,active").eq("user_id", user.id).maybeSingle();
    if (staff.data?.role === "admin" && staff.data.active) redirect(`/${locale}/admin`);
  }

  const fr = locale === "fr";
  return (
    <section className="section-padding min-h-[70vh]" aria-labelledby="admin-login-title">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Andrino</p>
        <h1 id="admin-login-title" className="mt-3 font-serif text-4xl">
          {fr ? "Connexion admin" : "Admin sign in"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {fr ? "Connectez-vous avec votre compte administrateur." : "Sign in with your administrator account."}
        </p>
        <LoginForm locale={locale} />
      </div>
    </section>
  );
}
