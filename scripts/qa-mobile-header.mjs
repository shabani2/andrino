import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.QA_NODE_MODULES
  ? path.join(process.env.QA_NODE_MODULES, "playwright")
  : "playwright");
const base = process.env.QA_URL || "http://127.0.0.1:3002";
const directory = path.resolve("artifacts/qa-mobile-header", new URL(base).hostname);
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const results = [], interactions = [], errors = [];

try {
  for (const locale of ["fr", "en"]) {
    const context = await browser.newContext({
      locale: locale === "fr" ? "fr-FR" : "en-GB",
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 812 });
      const response = await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200);
      const trigger = page.locator("header .language-trigger");
      await trigger.waitFor({ state: "visible" });
      await page.locator("header .theme-segments").waitFor({ state: "visible" });
      const layout = await page.evaluate(() => {
        const header = document.querySelector("header").getBoundingClientRect();
        const prefs = document.querySelector("header .reading-preferences").getBoundingClientRect();
        const brand = document.querySelector(".brand").getBoundingClientRect();
        const menu = document.querySelector(".menu-button").getBoundingClientRect();
        const nav = document.querySelector(".desktop-nav").getBoundingClientRect();
        const actions = document.querySelector(".header-actions").getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          headerBottom: header.bottom,
          controlsTop: prefs.top,
          controlsBottom: prefs.bottom,
          contentOffset: parseFloat(getComputedStyle(document.querySelector("#main-content")).paddingTop),
          overlap: innerWidth < 1024 ? brand.right > menu.left : brand.right > nav.left || nav.right > actions.left,
          footerHidden: getComputedStyle(document.querySelector("footer .reading-preferences")).display === "none",
          targets: [...document.querySelectorAll("header .segment-option,header .language-trigger")].map((node) => {
            const rect = node.getBoundingClientRect();
            return { width: rect.width, height: rect.height };
          }),
        };
      });
      assert.equal(layout.overflow, false, `${locale} ${width}: overflow`);
      assert.equal(layout.overlap, false, `${locale} ${width}: header overlap`);
      assert.ok(layout.controlsTop >= 0 && layout.controlsBottom <= layout.headerBottom + 1);
      assert.ok(layout.contentOffset >= layout.headerBottom, "Content must clear the fixed header");
      if (width < 1024) {
        assert.equal(layout.footerHidden, true);
        assert.ok(layout.targets.every((target) => target.width >= 44 && target.height >= 44));
        assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
      }
      await trigger.click();
      await page.getByRole("menuitemradio", { name: /English/ }).waitFor({ state: "visible" });
      await page.keyboard.press("Escape");
      if (width === 375) await page.screenshot({ path: path.join(directory, `${locale}-light.png`) });
      results.push({ locale, width, ...layout });
    }

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
    await page.locator("header").getByRole("radio", { name: locale === "fr" ? "Sombre" : "Dark", exact: true }).click();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
    await page.screenshot({ path: path.join(directory, `${locale}-dark.png`) });
    await page.locator("header .language-trigger").click();
    await page.getByRole("menuitemradio", { name: locale === "fr" ? /English/ : /Français/ }).click();
    const nextLocale = locale === "fr" ? "en" : "fr";
    await page.waitForURL(`**/${nextLocale}`);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    assert.equal(await page.locator("html").getAttribute("lang"), nextLocale);
    await page.evaluate(() => window.scrollTo(0, 500));
    const controlPosition = await page.locator("header .language-trigger").boundingBox();
    assert.ok(controlPosition.y >= 0 && controlPosition.y < 136, "Preferences stay at the top after scrolling");
    await page.locator(".menu-button").click();
    assert.equal(await page.locator(".mobile-menu .reading-preferences").count(), 0);
    const menuPosition = await page.locator(".mobile-menu").boundingBox();
    assert.equal(menuPosition.y, 136, "Navigation clears both header rows");
    await page.screenshot({ path: path.join(directory, `${locale}-menu.png`) });
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
    interactions.push({ locale, visibleWithoutMenu: true, languageAndThemePersist: true, stickyControls: true, menuOffset: true });
    await context.close();
  }
  assert.equal(errors.length, 0);
  console.log(JSON.stringify({ base, views: results.length, interactions, errors }, null, 2));
} finally {
  await fs.writeFile(path.join(directory, "report.json"), JSON.stringify({ base, results, interactions, errors }, null, 2));
  await browser.close();
}
