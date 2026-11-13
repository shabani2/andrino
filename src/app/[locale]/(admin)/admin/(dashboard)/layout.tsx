import type { ReactNode } from "react";
import { requireStaff } from "@/lib/admin-guard";
import { signOut } from "../actions";
import { AdminShell } from "./admin-shell";

export default async function AdminLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { staff, user } = await requireStaff(locale);

  return (
    <AdminShell locale={locale} email={user.email ?? ""} displayName={staff.display_name}
      role={staff.role} signOutAction={signOut.bind(null, locale)}>
      {children}
    </AdminShell>
  );
}
