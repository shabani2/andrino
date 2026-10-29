import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.QA_NODE_MODULES ? path.join(process.env.QA_NODE_MODULES, "playwright") : "playwright");
const base = process.env.QA_URL || "http://127.0.0.1:3002";
const directory = path.resolve(process.env.QA_INTERACTIONS_ONLY ? "artifacts/qa-switchers" : "artifacts/qa-preferences");
await fs.mkdir(directory, { recursive: true });
const en = JSON.parse(await fs.readFile("messages/en.json", "utf8"));
const fr = JSON.parse(await fs.readFile("messages/fr.json", "utf8"));
const sourceToFrench = Object.fromEntries(Object.entries(en.copy).filter(([key, value]) => value !== fr.copy[key]).map(([key, value]) => [value, fr.copy[key]]));
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || "msedge", headless: true });
const results = [], interactions = [], errors = [];
const routes = ["/", "/about", "/portfolio", "/writing", "/projects", "/contact", "/links"];
const record = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !message.text().includes("404")) errors.push(message.text()); });
};
const report = async () => fs.writeFile(path.join(directory, "report.json"), JSON.stringify({ base, results, interactions, errors }, null, 2) + "\n");

try {
  for (const locale of process.env.QA_INTERACTIONS_ONLY ? [] : ["en", "fr"]) {
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({ locale: locale === "fr" ? "fr-FR" : "en-GB", colorScheme: theme, reducedMotion: "reduce" });
      const page = await context.newPage();
      record(page);
      for (const width of [1440, 768, 375]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const route of routes) {
          const href = "/" + locale + (route === "/" ? "" : route);
          const response = await page.goto(base + (href || "/"), { waitUntil: "networkidle" });
          assert.equal(response.status(), 200, href);
          await page.evaluate(async () => {
            await document.fonts.ready;
            for (const image of document.images) image.loading = "eager";
            await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
          });
          await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
          const audit = await page.evaluate(async ({ locale, translations }) => {
            const axe = await window.axe.run(document.body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
            const untranslated = [];
            if (locale === "fr") {
              const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
              while (walker.nextNode()) {
                const node = walker.currentNode;
                if (!(node.parentElement instanceof HTMLElement) || !node.parentElement.checkVisibility()) continue;
                const text = node.textContent.replace(/\s+/g, " ").trim();
                if (translations[text]) untranslated.push(text);
              }
            }
            return {
              language: document.documentElement.lang,
              theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
              h1Count: document.querySelectorAll("h1").length,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              brokenImages: [...document.images].filter((image) => !image.naturalWidth).map((image) => image.currentSrc),
              untranslated: [...new Set(untranslated)],
              violations: axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })) })),
            };
          }, { locale, translations: sourceToFrench });
          // Full captures at desktop/mobile, audit also at tablet width.
          if (width !== 768) await page.screenshot({ path: path.join(directory, `${locale}-${theme}-${route === "/" ? "home" : route.slice(1)}-${width}.png`), fullPage: true });
          results.push({ route, locale, expectedTheme: theme, width, ...audit });
          await report();
          console.log(JSON.stringify({ route, locale, theme, width, overflow: audit.overflow, untranslated: audit.untranslated.length, axe: audit.violations.length }));
        }
      }
      await context.close();
    }
  }

  const context = await browser.newContext({ locale: "en-GB", colorScheme: "light" });
  const page = await context.newPage();
  record(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base, { waitUntil: "networkidle" });
  const appearance = () => page.locator("footer").getByRole("radiogroup", { name: /Appearance|Apparence/ });
  const language = () => page.locator("footer").getByRole("radiogroup", { name: /Language|Langue/ });
  await appearance().getByRole("radio", { name: "Dark", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await appearance().getByRole("radio", { name: "Dark", exact: true }).getAttribute("aria-checked"), "true");
  assert.equal(await page.evaluate(() => localStorage.getItem("andrino-theme")), "dark");
  await appearance().getByRole("radio", { name: "System", exact: true }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.waitForFunction(() => document.documentElement.classList.contains("light"));
  await appearance().getByRole("radio", { name: "Light", exact: true }).click();
  await page.emulateMedia({ colorScheme: "dark" });
  assert.ok((await page.locator("html").getAttribute("class")).includes("light"));
  interactions.push("Explicit theme persists after reload; system follows OS changes; explicit light overrides dark OS.");
  await page.locator("header").getByRole("radio", { name: "System", exact: true }).focus();
  // Radix defers the focus hand-off; keep the key held until selection updates.
  await page.keyboard.down("ArrowLeft");
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.keyboard.up("ArrowLeft");
  assert.equal(await page.locator("header").getByRole("radio", { name: "Dark", exact: true }).getAttribute("aria-checked"), "true");
  const languageTrigger = () => page.locator("header").getByRole("button", { name: /^Language|^Langue/ });
  await languageTrigger().focus();
  await page.keyboard.press("Enter");
  await page.getByRole("menuitemradio", { name: /English/ }).waitFor();
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector("header .language-trigger") === document.activeElement);
  interactions.push("Header theme supports arrow keys; language popup opens by keyboard and Escape restores trigger focus.");

  await page.goto(base + "/portfolio", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Humanitarian Storytelling", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll(".portfolio-card").length === 1);
  const query = new URL(page.url()).search;
  await languageTrigger().click();
  await page.getByRole("menuitemradio", { name: /Français/ }).focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/fr\/portfolio\?/);
  await page.waitForFunction(() => document.documentElement.lang === "fr");
  assert.equal(new URL(page.url()).search, query);
  assert.equal(await page.locator(".portfolio-card").count(), 1);
  assert.match(await page.locator(".portfolio-card h2").innerText(), /humanitaires/);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await language().getByRole("radio", { name: "Français", exact: true }).getAttribute("aria-checked"), "true");
  await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).pathname, "/fr");
  await page.goto(base + "/fr/about#main-content", { waitUntil: "networkidle" });
  await language().getByRole("radio", { name: "English", exact: true }).click();
  await page.waitForURL("**/en/about#main-content");
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  interactions.push("Language switch preserves route, category filters and anchor; preference survives reload and root revisit.");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base + "/fr", { waitUntil: "networkidle" });
  const mobileTheme = page.locator("header").getByRole("radio", { name: "Sombre", exact: true });
  await mobileTheme.click();
  assert.equal(await page.getByRole("button", { name: "Ouvrir le menu" }).getAttribute("aria-expanded"), "false");
  await languageTrigger().click();
  await page.getByRole("menuitemradio", { name: /English/ }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await languageTrigger().evaluate((node) => node === document.activeElement), true);
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Ouvrir le menu" }).getAttribute("aria-expanded"), "false");
  assert.ok((await page.locator("html").getAttribute("class")).includes("dark"));
  interactions.push("Mobile header exposes theme and language with navigation closed; popup focus and menu Escape work.");

  await page.goto(base + "/fr/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Envoyer un message" }).click();
  await page.locator(".form-feedback.error").waitFor();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 5);
  assert.match(await page.locator(".form-feedback").innerText(), /Veuillez vérifier/);
  assert.equal(await page.locator(".form-feedback").evaluate((node) => node === document.activeElement), true);
  if (!process.env.RESEND_API_KEY && !existsSync(".env") && !existsSync(".env.local")) {
    await page.locator("#contact-name").fill("Vérification locale");
    await page.locator("#contact-email").fill("qa@example.com");
    await page.locator("#contact-subject").selectOption("Creative collaboration");
    await page.locator("#contact-message").fill("Un message de vérification locale, sans envoi réel de courrier.");
    await page.locator("#contact-consent").check();
    await page.getByRole("button", { name: "Envoyer un message" }).click();
    await page.getByText("L’envoi des messages n’est pas encore disponible.", { exact: false }).waitFor();
    assert.equal(await page.locator("#contact-name").inputValue(), "Vérification locale");
  }
  interactions.push("French form labels, server validation, focused errors and missing-provider feedback work; no real email sent.");

  for (const route of ["/fr/portfolio/strategic-communication", "/fr/writing/african-narratives", "/fr/projects/naleta-story"]) {
    const response = await page.goto(base + route, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("html").getAttribute("lang"), "fr");
    assert.equal(await page.locator('link[rel="alternate"][hreflang="en"]').count(), 1);
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute("href")).endsWith(route));
  }
  const sitemap = await fetch(base + "/sitemap.xml").then((response) => response.text());
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  assert.equal(paths.length, 44);
  for (const pathname of paths) {
    const response = await fetch(base + pathname, { headers: { "Accept-Language": "en" } });
    assert.equal(response.status, 200, pathname);
  }
  interactions.push("All 44 sitemap routes respond; localized detail metadata and language alternatives are present.");
  await context.close();
  await report();
  const failures = results.filter((r) => r.language !== r.locale || r.theme !== r.expectedTheme || r.h1Count !== 1 || r.overflow || r.brokenImages.length || r.untranslated.length || r.violations.length);
  console.log(JSON.stringify({ views: results.length, failures, interactions, errors }, null, 2));
  assert.equal(failures.length, 0, "See artifacts/qa-preferences/report.json");
  assert.equal(errors.length, 0, "Browser errors");
} finally {
  await report();
  await browser.close();
}
