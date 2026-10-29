import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createTranslator } from "next-intl";

const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const en = await read("messages/en.json");
const fr = await read("messages/fr.json");
const sourceKeys = await read("src/i18n/source-keys.json");
function flatten(value, prefix = "") {
  return Object.entries(value).flatMap(([key, item]) => {
    const name = prefix ? prefix + "." + key : key;
    return typeof item === "object" ? flatten(item, name) : [[name, item]];
  });
}
const english = flatten(en);
const french = flatten(fr);
assert.deepEqual(english.map(([key]) => key).sort(), french.map(([key]) => key).sort());
for (const [source, key] of Object.entries(sourceKeys)) {
  assert.equal(en.copy[key], source, "Source text must match its stable catalog ID");
}
for (const [locale, messages] of [["en", en], ["fr", fr]]) {
  const t = createTranslator({ locale, messages, onError: (error) => { throw error; } });
  for (const [key, value] of flatten(messages)) {
    assert.equal(typeof value, "string");
    assert.ok(value.trim().length, key);
    assert.equal(typeof t(key), "string", key);
  }
}
console.log(`English and French: ${english.length} matching messages, valid ICU syntax and source IDs.`);
