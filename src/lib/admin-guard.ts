import "server-only";
import { redirect } from "next/navigation";
import { adminSessionClient } from "@/lib/admin-session";

export async function requireStaff(locale: string, adminOnly = false) {
  const language = locale === "fr" ? "fr" : "en";
  const supabase = await adminSessionClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect(`/${language}/admin/login`);

  const { data: staff, error: staffError } = await supabase.from("staff_members")
    .select("user_id,role,active,display_name,avatar_path,phone")
    .eq("user_id", user.id)
    .maybeSingle();
  if (staffError || !staff?.active) redirect(`/${language}/admin/login`);
  if (adminOnly && staff.role !== "admin") redirect(`/${language}/admin`);

  return { supabase, user, staff, language };
}
