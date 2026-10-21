import { test, expect } from "@playwright/test";

async function openApp(page, { tutorial = false, saved = null } = {}) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  if (!tutorial) await page.addInitScript((value) => {
    localStorage.setItem("tradecraft-academy-qa-v1", JSON.stringify(value));
  }, saved || { profile: {}, progress: {}, settings: { theme: "light", tutorialSeen: true } });
  await page.goto("/?qa=1");
  await expect.poll(() => page.evaluate(() => window.tradecraftReady)).toBe(true);
  await expect(page.locator("#boot-error")).toBeHidden();
  return errors;
}

test("az alkalmazás elindul, navigál és keres", async ({ page }) => {
  const errors = await openApp(page);
  await page.locator('.main-nav [data-view-target="roadmap"]').click();
  await expect(page.locator("#page-title")).toHaveText("Roadmap");

  await page.keyboard.press("Control+K");
  await page.locator("#search-input").fill("delta cvd");
  await expect(page.locator("#search-results [data-result]").first()).toBeVisible();
  await page.locator("#search-input").press("Enter");
  await expect(page.locator("#view-lecke")).toBeVisible();
  await expect(page.locator("#page-title")).toContainText(/Delta|CVD/i);
  expect(errors).toEqual([]);
});

test("a teljes ZIP mentés letölthető", async ({ page }) => {
  const errors = await openApp(page);
  await page.locator("[data-open-settings]:visible").first().click();
  await expect(page.locator("#settings-dialog")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-data").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^tradecraft-teljes-mentes-\d{4}-\d{2}-\d{2}\.zip$/);
  expect(errors).toEqual([]);
});

test("a nézet nem lóg túl, és a sötét téma kapcsolható", async ({ page }) => {
  const errors = await openApp(page, { saved: { schemaVersion: 1, profile: {}, progress: {}, settings: { theme: "system", tutorialSeen: true } } });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.locator("[data-open-settings]:visible").first().click();
  await page.locator('#settings-form select[name="theme"]').selectOption("dark");
  await page.locator('#settings-form button[type="submit"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const widths = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  expect(errors).toEqual([]);
});

test("a modulvizsga elindítható és választ fed fel", async ({ page }) => {
  const errors = await openApp(page);
  await page.locator('.main-nav [data-view-target="gyakorlas"]').click();
  await page.locator('[data-tab="practice:exam"]').click();
  await expect(page.locator("#exam-module option")).toHaveCount(6);
  await page.locator("[data-exam-start]").click();
  await expect(page.locator(".exam-question")).toBeVisible();
  await page.locator("[data-exam-reveal]").click();
  await expect(page.locator("[data-exam-grade]")).toHaveCount(2);
  await page.locator('[data-exam-grade="wrong"]').click();
  await page.locator('[data-tab="practice:mistakes"]').click();
  await expect(page.locator(".mistake-card")).toHaveCount(1);
  await expect(page.locator("#mistake-count")).toHaveText("1");
  expect(errors).toEqual([]);
});

test("az első indításos bemutató kiemel és továbblép", async ({ page }) => {
  const errors = await openApp(page, { tutorial: true });
  await expect(page.locator("#tutorial-card")).toBeVisible();
  await expect(page.locator("#tutorial-step")).toHaveText("1 / 7");
  await expect(page.locator("#tutorial-highlight")).toBeVisible();
  await expect(page.locator("#tutorial-back")).toBeHidden();
  await page.locator("#tutorial-next").click();
  await expect(page.locator("#tutorial-step")).toHaveText("2 / 7");
  await expect(page.locator("#page-title")).toHaveText("Roadmap");
  for (const [step, title] of [[3, "Tananyag"], [4, "Gyakorlás"], [5, "Napló"], [6, "Áttekintés"], [7, "Áttekintés"]]) {
    await expect(page.locator("#tutorial-card")).toBeVisible();
    await expect(page.locator("#tutorial-next")).toBeVisible();
    await page.locator("#tutorial-next").click();
    await expect(page.locator("#tutorial-step")).toHaveText(`${step} / 7`);
    await expect(page.locator("#page-title")).toHaveText(title);
  }
  await expect(page.locator("#tutorial-next")).toContainText("Kész");
  await page.locator("#tutorial-next").click();
  await expect(page.locator("#tutorial-card")).toBeHidden();
  expect(errors).toEqual([]);
});

test("a hiányzó statikus fájl 404 választ ad", async ({ request }) => {
  const response = await request.get("/nem-letezo-modul.js");
  expect(response.status()).toBe(404);
  expect(response.headers()["content-type"]).toContain("text/plain");
});
