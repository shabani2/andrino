import Image from "next/image";
import { requireStaff } from "@/lib/admin-guard";
import { adminText } from "@/lib/admin-sections";
import { ProfileForms } from "./forms";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: adminText(locale, "Mon profil", "My profile"), robots: { index: false, follow: false } };
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { user, staff } = await requireStaff(locale);
  return (
    <div className="max-w-2xl">
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <h1 className="mt-2 font-serif text-4xl">{adminText(locale, "Mon profil", "My profile")}</h1>
      {staff.avatar_path && (
        <Image src={staff.avatar_path} alt={adminText(locale, "Photo de profil", "Profile photo")}
          width={96} height={96} className="mt-6 size-24 rounded-full object-cover" />
      )}
      <ProfileForms locale={locale} email={user.email ?? ""}
        displayName={staff.display_name} phone={staff.phone} />
    </div>
  );
}
