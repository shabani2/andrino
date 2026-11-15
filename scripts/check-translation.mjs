import assert from "node:assert/strict";
import { translateContent } from "../src/lib/content-translation.ts";

const requests = [];
const mockFetch = async (url) => {
  const query = new URL(url);
  const text = query.searchParams.get("q");
  requests.push({ text, pair: query.searchParams.get("langpair") });
  return new Response(JSON.stringify({
    responseStatus: 200,
    responseData: { translatedText: `T[${text}]` },
  }), { status: 200 });
};
const source = {
  title: "L’Afrique et l’OIF",
  summary: "Un bref résumé.",
  body: `## Un intertitre\n\n${"Une phrase sur l’économie. ".repeat(40)}\n\nSource : https://example.org/report`,
  category_label: "Opinion",
  project_status: "",
  cover_alt: "Drapeaux de deux pays",
};
const english = await translateContent(source, "fr", undefined, mockFetch);
assert.ok(english.body.startsWith("## T[Un intertitre]"));
assert.ok(english.body.includes("https://example.org/report"));
assert.ok(requests.length > 5);
assert.ok(requests.every(({ text, pair }) => Buffer.byteLength(text, "utf8") <= 500 && pair === "fr|en"));

requests.length = 0;
const french = await translateContent({ ...source, title: "An English title", body: "One paragraph." }, "en", undefined, mockFetch);
assert.equal(french.title, "T[An English title]");
assert.ok(requests.every(({ pair }) => pair === "en|fr"));

await assert.rejects(
  translateContent(source, "fr", undefined, async () => new Response("Unavailable", { status: 429 })),
  /Translation HTTP 429/,
);
console.log("Translation checks passed");
