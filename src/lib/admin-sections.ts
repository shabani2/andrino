import type { EntryKind } from "@/lib/content-repository";

export const contentSections = {
  articles: { kind: "article", fr: "Articles", en: "Articles" },
  projets: { kind: "project", fr: "Projets", en: "Projects" },
  rubriques: { kind: "practice_area", fr: "Rubriques", en: "Sections" },
  themes: { kind: "writing_theme", fr: "Thèmes d’écriture", en: "Writing themes" },
  portfolio: { kind: "case_study", fr: "Études de cas", en: "Case studies" },
} as const satisfies Record<string, { kind: EntryKind; fr: string; en: string }>;

export type ContentSection = keyof typeof contentSections;

export function isContentSection(value: string): value is ContentSection {
  return Object.hasOwn(contentSections, value);
}

export function adminText(locale: string, fr: string, en: string) {
  return locale === "fr" ? fr : en;
}
