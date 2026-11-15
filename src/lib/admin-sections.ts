import type { EntryKind } from "@/lib/content-repository";

export const contentSections = {
  articles: { kind: "article", fr: "Articles", en: "Articles" },
  projets: { kind: "project", fr: "Projets", en: "Projects" },
  rubriques: { kind: "practice_area", fr: "Rubriques", en: "Categories" },
} as const satisfies Record<string, { kind: EntryKind; fr: string; en: string }>;

export type ContentSection = keyof typeof contentSections;

export function isContentSection(value: string): value is ContentSection {
  return Object.hasOwn(contentSections, value);
}

export function adminText(locale: string, fr: string, en: string) {
  return locale === "fr" ? fr : en;
}
