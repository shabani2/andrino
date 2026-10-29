import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const pages = ["home", "about", "portfolio", "writing", "projects", "contact"];
const manifest = {};
const downloads = new Map();
for (const page of pages) {
  const html = await fs.readFile(
    path.join(root, "design/stitch", `${page}.html`),
    "utf8",
  );
  manifest[page] = [];
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const src = /\bsrc="([^"]+)"/.exec(match[0])?.[1];
    if (!src || !src.includes("/aida-public/")) continue;
    let destination = downloads.get(src);
    if (!destination) {
      destination = `/images/${page === "writing" ? "articles" : page}/${page}-${manifest[page].length + 1}.webp`;
      downloads.set(src, destination);
    }
    manifest[page].push({
      src: destination,
      original: src,
      description: /data-alt="([^"]+)"/.exec(match[0])?.[1] || "",
    });
  }
}
await fs.mkdir(path.join(root, "public/fonts"), { recursive: true });
const jobs = [...downloads].map(([url, destination]) => async () => {
  const file = path.join(root, "public", destination);
  try {
    await fs.access(file);
    return;
  } catch {}
  await fs.mkdir(path.dirname(file), { recursive: true });
  const response = await fetch(url, { signal: AbortSignal.timeout(90000) });
  if (!response.ok) throw new Error(`${response.status}: ${destination}`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(file);
  console.log(`Imported ${destination}`);
});
let current = 0;
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (current < jobs.length) await jobs[current++]();
  }),
);
await fs.writeFile(
  path.join(root, "design/stitch/assets.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

const cssResponse = await fetch(
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..700&family=Newsreader:ital,wght@0,400..600;1,400..600&display=swap",
  {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(60000),
  },
);
if (!cssResponse.ok) throw new Error(`Font stylesheet: ${cssResponse.status}`);
const css = await cssResponse.text();
for (const block of css.matchAll(
  /\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g,
)) {
  const face = block[1];
  const family = /font-family:\s*'([^']+)'/.exec(face)?.[1];
  const italic = /font-style:\s*italic/.test(face);
  const url = /url\(([^)]+)\)/.exec(face)?.[1];
  if (!family || !url) continue;
  const file = `${family === "Newsreader" ? "newsreader" : "dm-sans"}${italic ? "-italic" : ""}-latin.woff2`;
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Font download: ${response.status}`);
  await fs.writeFile(
    path.join(root, "public/fonts", file),
    Buffer.from(await response.arrayBuffer()),
  );
  console.log(`Imported font ${file}`);
}
console.log(`Complete: ${downloads.size} unique images.`);
