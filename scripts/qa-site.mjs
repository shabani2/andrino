import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.QA_NODE_MODULES ? path.join(process.env.QA_NODE_MODULES, "playwright") : "playwright");
const axePath = require.resolve("axe-core/axe.min.js");
const base = process.env.QA_URL || "http://127.0.0.1:3000";
const directory = path.resolve("artifacts/qa");
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || "msedge", headless: true });
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: "reduce" });
const page = await context.newPage();
const consoleErrors = [];
const networkFailures = [];
page.on("pageerror", (error) => consoleErrors.push(error.message));
page.on("response", (response) => { if (response.status() >= 400 && response.url().startsWith(base)) networkFailures.push({ url: response.url(), status: response.status() }); });
const results = [];
const interactions = [];

try {
  for (const width of [1440, 768, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/about", "/portfolio", "/writing", "/projects", "/contact", "/links"]) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200, route);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const image of document.images) image.loading = "eager";
        await Promise.all([...document.images].map((image) => image.decode().catch(() => {})));
      });
      await page.addScriptTag({ path: axePath });
      const audit = await page.evaluate(async () => {
        const axe = await window.axe.run(document.querySelector("body"), { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
        return {
          title: document.title,
          heading: document.querySelector("h1")?.textContent,
          h1Count: document.querySelectorAll("h1").length,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          brokenImages: [...document.images].filter((image) => !image.naturalWidth).map((image) => image.currentSrc),
          deadLinks: [...document.querySelectorAll("a")].filter((link) => link.getAttribute("href") === "#").length,
          violations: axe.violations.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })),
        };
      });
      const filename = (route === "/" ? "home" : route.slice(1)) + "-" + width + ".png";
      await page.screenshot({ path: path.join(directory, filename), fullPage: true });
      const result = { route, width, ...audit, screenshot: filename };
      results.push(result);
      await fs.writeFile(path.join(directory, "report.json"), JSON.stringify({ base, results, interactions, consoleErrors, networkFailures }, null, 2) + "\n");
      console.log(JSON.stringify({ route, width, overflow: audit.overflow, brokenImages: audit.brokenImages.length, axeViolations: audit.violations.length }));
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/portfolio", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Humanitarian Storytelling", exact: true }).click();
  await page.waitForURL(/category=/);
  await page.waitForFunction(() => document.querySelectorAll(".portfolio-card").length === 1);
  assert.match(await page.locator(".portfolio-card h2").innerText(), /Humanitarian/);
  await page.getByRole("button", { name: "All work (6)", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll(".portfolio-card").length === 6);
  interactions.push("Portfolio category filter and reset: passed");

  await page.goto(base + "/writing?category=Personal+Reflections", { waitUntil: "networkidle" });
  assert.equal(await page.locator(".writing-grid .article-card").count(), 1);
  await page.getByRole("button", { name: "All themes", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll(".writing-grid .article-card").length === 6);
  interactions.push("Writing deep-link and filter reset: passed");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("button", { name: "Open navigation" }).getAttribute("aria-expanded"), "false");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await page.waitForURL("**/about");
  assert.equal(await page.locator("#mobile-navigation").count(), 0);
  interactions.push("Mobile menu, Escape and navigation: passed");

  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Send a message" }).click();
  await page.locator(".form-feedback.error").waitFor();
  assert.equal(await page.locator('[aria-invalid="true"]').count(), 5);
  assert.equal(await page.locator(".form-feedback").evaluate((element) => element === document.activeElement), true);
  interactions.push("Contact empty-form server validation and focused error summary: passed");
  if (!process.env.RESEND_API_KEY && !existsSync(".env.local") && !existsSync(".env")) {
    await page.getByLabel("Full name", { exact: false }).fill("Editorial QA");
    await page.getByLabel("Email address", { exact: false }).fill("editorial-qa@example.com");
    await page.getByLabel("Subject / Nature", { exact: false }).selectOption("Creative collaboration");
    await page.getByLabel("Your message", { exact: false }).fill("This is a local verification of the contact form. No email should be sent.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send a message" }).click();
    await page.getByText("Message delivery is not available yet.", { exact: false }).waitFor();
    assert.equal(await page.locator("#contact-name").inputValue(), "Editorial QA");
    interactions.push("Contact unconfigured-provider error, preserved values, no email sent: passed");
  }

  for (const route of ["/portfolio/strategic-communication", "/writing/african-narratives", "/projects/naleta-story"]) {
    const response = await page.goto(base + route, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
  }
  interactions.push("Portfolio, writing and project detail routes: passed");

  const report = { base, date: new Date().toISOString(), results, interactions, consoleErrors, networkFailures };
  await fs.writeFile(path.join(directory, "report.json"), JSON.stringify(report, null, 2) + "\n");
  const failures = results.filter((result) => result.overflow || result.brokenImages.length || result.deadLinks || result.h1Count !== 1 || result.violations.length);
  console.log(JSON.stringify({ pages: results.length, visualOrA11yFailures: failures.length, interactions, consoleErrors, networkFailures }, null, 2));
  assert.equal(failures.length, 0, "See artifacts/qa/report.json for visual/a11y failures.");
  assert.equal(consoleErrors.length, 0, "Browser console errors");
  assert.equal(networkFailures.length, 0, "Failed application requests");
} finally {
  await browser.close();
}
