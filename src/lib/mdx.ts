import { readdir } from "node:fs/promises";
import path from "node:path";

export type ContentCollection = "articles" | "portfolio" | "projects";

// Inventaire uniquement : le moteur de rendu MDX sera choisi avec le contexte.
export async function getMdxSlugs(
  collection: ContentCollection,
): Promise<string[]> {
  const directory = path.join(process.cwd(), "src", "content", collection);
  const files = await readdir(directory);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -4));
}
