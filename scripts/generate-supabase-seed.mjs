import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { portfolioAreas, projectDirections, writingThemes } from "../src/content/editorial.ts";
import keys from "../src/i18n/source-keys.json" with { type: "json" };
import en from "../messages/en.json" with { type: "json" };
import fr from "../messages/fr.json" with { type: "json" };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quote = (value) => value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const array = (values) => `array[${values.map(quote).join(", ")}]::text[]`;
const localize = (value, locale) => {
  if (!value) return value ?? "";
  const key = keys[value.trim()];
  return key ? (locale === "fr" ? fr : en).copy[key] ?? value : value;
};

const records = [
  ...writingThemes.map((item, index) => ({
    kind: "writing_theme", item, index, body: [item.description], status: null,
  })),
  ...projectDirections.map((item, index) => ({
    kind: "project", item, index, body: item.paragraphs, status: item.status,
  })),
  ...portfolioAreas.map((item, index) => ({
    kind: "practice_area", item, index, body: [item.description], status: null,
  })),
];

const sql = [
  "-- Existing editorial material, published in both languages.",
  "-- Re-running this seed never overwrites later editorial changes.",
  "begin;",
];
for (const { kind, item, index, body, status } of records) {
  sql.push(`insert into public.entries
    (kind, slug, category_code, tags, cover_path, gallery_paths, external_url, featured, sort_order)
    values (${quote(kind)}, ${quote(item.slug)}, ${quote(item.category ?? null)},
      ${array(item.tags)}, ${quote(item.image)}, ${array([item.image])},
      ${quote(item.url ?? null)}, ${index === 0}, ${index})
    on conflict (kind, slug) do nothing;`);
  for (const locale of ["en", "fr"]) {
    const title = localize(item.title, locale);
    const summary = localize(item.description, locale);
    const translatedBody = body.map((paragraph) => localize(paragraph, locale)).join("\n\n");
    sql.push(`insert into public.entry_translations
      (entry_id, locale, title, summary, body, category_label, project_status,
       cover_alt, seo_title, seo_description, state, published_at)
      select id, ${quote(locale)}, ${quote(title)}, ${quote(summary)},
             ${quote(translatedBody)}, ${quote(localize(item.category ?? null, locale) || null)},
             ${quote(status ? localize(status, locale) : null)},
             ${quote(localize(item.alt, locale))}, ${quote(title)}, ${quote(summary)},
             'published', now()
      from public.entries where kind = ${quote(kind)} and slug = ${quote(item.slug)}
      on conflict (entry_id, locale) do nothing;`);
  }
}
sql.push("commit;", "");
const destination = path.join(root, "supabase", "seed.sql");
await writeFile(destination, sql.join("\n"), "utf8");
console.log(`Generated ${records.length} bilingual entries in ${destination}`);
