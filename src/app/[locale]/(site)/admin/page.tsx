import Link from "next/link";
import { redirect } from "next/navigation";
import { adminSessionClient } from "@/lib/admin-session";
import { Button } from "@/components/ui/button";
import { signOut } from "./actions";

export const metadata = { title: "Administration", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await adminSessionClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  const staff = await supabase.from("staff_members")
    .select("role,active,display_name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (staff.data?.role !== "admin" || !staff.data.active) {
    redirect(`/${locale}/admin/login`);
  }

  const fr = locale === "fr";
  return (
    <section className="section-padding min-h-[70vh]" aria-labelledby="admin-title">
      <div className="editorial-container max-w-3xl">
        <p className="text-sm font-medium text-muted-foreground">Andrino</p>
        <h1 id="admin-title" className="mt-3 font-serif text-4xl">
          Administration
        </h1>
        <div className="mt-8 rounded-2xl border border-border bg-card p-7">
          <p className="font-medium">{staff.data.display_name || user.email}</p>
          {staff.data.display_name && <p className="text-sm text-muted-foreground">{user.email}</p>}
          <p className="mt-3 text-sm text-muted-foreground">
            {fr ? "Votre accès administrateur est actif." : "Your administrator access is active."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <form action={signOut.bind(null, locale)}>
              <Button type="submit">{fr ? "Se déconnecter" : "Sign out"}</Button>
            </form>
            <Button asChild variant="outline">
              <Link href={`/${locale}`}>{fr ? "Voir le site" : "View site"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
