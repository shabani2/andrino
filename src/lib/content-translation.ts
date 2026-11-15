export type TranslatableContent = {
  title: string;
  summary: string;
  body: string;
  category_label: string;
  project_status: string;
  cover_alt: string;
};

type Locale = "fr" | "en";

const MAX_SEGMENT_BYTES = 450;
const TRANSLATION_ENDPOINT = "https://api.mymemory.translated.net/get";

function chunksOf(value: string): string[] {
  const chunks: string[] = [];
  let remaining = value.trim();
  while (Buffer.byteLength(remaining, "utf8") > MAX_SEGMENT_BYTES) {
    let end = 0;
    let bytes = 0;
    for (const character of remaining) {
      const next = Buffer.byteLength(character, "utf8");
      if (bytes + next > MAX_SEGMENT_BYTES) break;
      bytes += next;
      end += character.length;
    }
    const window = remaining.slice(0, end);
    const sentence = [...window.matchAll(/(?<=[.!?;:])\s+/g)].at(-1)?.index ?? 0;
    const whitespace = window.lastIndexOf(" ");
    const cut = sentence > end / 3 ? sentence : whitespace > 0 ? whitespace : end;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function decodeEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  };
  return value.replace(/&(#(?:x[0-9a-f]+|\d+)|amp|quot|apos|lt|gt|nbsp);/gi, (entity, name: string) => {
    if (name.startsWith("#")) {
      const hex = name[1]?.toLowerCase() === "x";
      const code = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) && code >= 0 && code <= 0x10ffff
        ? String.fromCodePoint(code) : entity;
    }
    return named[name.toLowerCase()] ?? entity;
  });
}

function limitConcurrent(maximum: number) {
  let active = 0;
  const waiting: Array<() => void> = [];
  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (active >= maximum) await new Promise<void>((resolve) => waiting.push(resolve));
    active += 1;
    try {
      return await task();
    } finally {
      active -= 1;
      waiting.shift()?.();
    }
  };
}

export async function translateContent(
  source: TranslatableContent,
  sourceLocale: Locale,
  contactEmail?: string,
  fetcher: typeof fetch = fetch,
): Promise<TranslatableContent> {
  const targetLocale: Locale = sourceLocale === "fr" ? "en" : "fr";
  const request = limitConcurrent(4);
  const translated = new Map<string, Promise<string>>();

  async function translateSegment(segment: string): Promise<string> {
    if (!segment.trim()) return segment;
    const existing = translated.get(segment);
    if (existing) return existing;
    const result = request(async () => {
      const url = new URL(TRANSLATION_ENDPOINT);
      url.searchParams.set("q", segment);
      url.searchParams.set("langpair", `${sourceLocale}|${targetLocale}`);
      if (contactEmail) url.searchParams.set("de", contactEmail);
      const response = await fetcher(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("responseStatus" in data) ||
          Number(data.responseStatus) !== 200 || !("responseData" in data) ||
          !data.responseData || typeof data.responseData !== "object" ||
          !("translatedText" in data.responseData) ||
          typeof data.responseData.translatedText !== "string" ||
          !data.responseData.translatedText.trim()) {
        throw new Error("Translation service rejected a segment");
      }
      const output = decodeEntities(data.responseData.translatedText.trim());
      return segment.includes("OIF") ? output.replace(/\bIOF\b/g, "OIF") : output;
    });
    translated.set(segment, result);
    return result;
  }

  async function translateText(value: string): Promise<string> {
    if (!value.trim()) return value;
    const leading = value.match(/^\s*/)?.[0] ?? "";
    const trailing = value.match(/\s*$/)?.[0] ?? "";
    const middle = value.slice(leading.length, value.length - trailing.length);
    const parts = middle.split(/(https?:\/\/[^\s)]+)/g);
    const converted = await Promise.all(parts.map(async (part) => {
      if (!part || /^https?:\/\//.test(part)) return part;
      if (!part.trim()) return part;
      const before = part.match(/^\s*/)?.[0] ?? "";
      const after = part.match(/\s*$/)?.[0] ?? "";
      const chunks = chunksOf(part);
      return before + (await Promise.all(chunks.map(translateSegment))).join(" ") + after;
    }));
    return leading + converted.join("") + trailing;
  }

  async function translateBody(value: string): Promise<string> {
    const lines = value.split("\n");
    return (await Promise.all(lines.map(async (line) => {
      if (!line.trim()) return line;
      const prefix = line.match(/^(\s*(?:#{1,6}\s+|[-*]\s+|\d+\.\s+))/)?.[0] ?? "";
      return prefix + await translateText(line.slice(prefix.length));
    }))).join("\n");
  }

  const [title, summary, body, category_label, project_status, cover_alt] = await Promise.all([
    translateText(source.title),
    translateText(source.summary),
    translateBody(source.body),
    translateText(source.category_label),
    translateText(source.project_status),
    translateText(source.cover_alt),
  ]);
  if (!title.trim() || title.length > 240 || (source.body.trim() && !body.trim())) {
    throw new Error("Translation is incomplete");
  }
  return { title, summary, body, category_label, project_status, cover_alt };
}
