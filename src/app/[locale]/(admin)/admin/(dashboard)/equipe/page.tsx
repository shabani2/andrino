import { requireStaff } from "@/lib/admin-guard";
import { adminText } from "@/lib/admin-sections";
import { privateSupabase } from "@/lib/supabase";
import { CreateMemberForm, LinkMemberForm, MemberControls } from "./forms";

export const metadata = { title: "Équipe", robots: { index: false, follow: false } };

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user } = await requireStaff(locale, true);
  const admin = privateSupabase();
  const members = await admin.from("staff_members")
    .select("user_id,role,active,display_name,phone,created_at").order("created_at");
  if (members.error) throw new Error("Team list unavailable");
  const authUsers = new Map<string, string>();
  for (let page = 1; ; page += 1) {
    const result = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (result.error) throw new Error("Auth users unavailable");
    result.data.users.forEach((item) => authUsers.set(item.id, item.email ?? ""));
    if (result.data.users.length < 1000) break;
  }

  return <div>
    <p className="text-sm text-muted-foreground">{adminText(locale, "Accès", "Access")}</p>
    <h1 className="mt-2 font-serif text-4xl">{adminText(locale, "Équipe", "Team")}</h1>
    <div className="mt-8 space-y-4">
      {members.data.map((member) => <article key={member.user_id} className="rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold">{member.display_name || authUsers.get(member.user_id) || member.user_id}</h2>
            {member.display_name && <p className="text-sm text-muted-foreground">{authUsers.get(member.user_id)}</p>}
            {member.phone && <p className="text-sm text-muted-foreground">{member.phone}</p>}
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs">
            {member.active ? adminText(locale, "Actif", "Active") : adminText(locale, "Inactif", "Inactive")}
          </span>
        </div>
        <MemberControls locale={locale} userId={member.user_id} role={member.role}
          active={member.active} self={member.user_id === user.id} />
      </article>)}
    </div>
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <CreateMemberForm locale={locale} />
      <LinkMemberForm locale={locale} />
    </div>
  </div>;
}
