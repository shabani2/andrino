import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/admin-guard";
import { contentSections, isContentSection } from "@/lib/admin-sections";
import { ContentEditor } from "../content-editor";

export const metadata = { title: "Modifier le contenu", robots: { index: false, follow: false } };

export default async function EditContentPage({ params }: {
  params: Promise<{ locale: string; section: string; id: string }>;
}) {
  const { locale, section, id } = await params;
  if (!isContentSection(section) || !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { supabase } = await requireStaff(locale);
  const result = await supabase.from("entries")
    .select("*,entry_translations(*)").eq("id", id).maybeSingle();
  if (result.error || result.data?.kind !== contentSections[section].kind) notFound();
  return <ContentEditor locale={locale} section={section}
    sectionTitle={locale === "fr" ? contentSections[section].fr : contentSections[section].en}
    entry={result.data} />;
}
