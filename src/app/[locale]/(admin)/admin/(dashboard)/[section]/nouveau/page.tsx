import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { contentSections, isContentSection } from "@/lib/admin-sections";
import { ContentEditor } from "../content-editor";

export const metadata = { title: "Créer un contenu", robots: { index: false, follow: false } };

export default async function NewContentPage({ params }: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isContentSection(section)) notFound();
  await requireStaff(locale);
  return <ContentEditor locale={locale} section={section}
    sectionTitle={locale === "fr" ? contentSections[section].fr : contentSections[section].en} />;
}
