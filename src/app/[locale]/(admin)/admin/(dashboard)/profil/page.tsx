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
    <div className="admin-profile-page">
      <p className="text-sm text-muted-foreground">{adminText(locale, "Votre compte", "Your account")}</p>
      <h1 className="mt-2 font-serif text-4xl">{adminText(locale, "Mon profil", "My profile")}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {adminText(locale, "Modifiez vos coordonnées et votre mot de passe.", "Edit your contact details and password.")}
      </p>
      <ProfileForms locale={locale} email={user.email ?? ""}
        displayName={staff.display_name} phone={staff.phone}
        avatarPath={staff.avatar_path} role={staff.role} />
    </div>
  );
}
