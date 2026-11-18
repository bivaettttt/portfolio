import { expect, test } from "@playwright/test";

test("case context, original media and gallery preserve keyboard focus", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("projects/personal/traceon/");
  const crumbs = page.locator(".case-breadcrumb");
  await expect(crumbs.getByRole("link")).toHaveCount(2);
  await expect(crumbs.locator("[aria-current=page]")).toHaveText("Traceon");
  await page.locator(".switcher summary").click();
  await expect(page.locator(".switcher a")).toHaveCount(9);
  await expect(page.locator(".switcher [aria-current=page]")).toHaveText(
    "Traceon",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator(".switcher summary")).toBeFocused();
  const frame = page.locator("#showcase [data-gallery]").first();
  await frame.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute(
    "src",
    /requirement\.png$/,
  );
  await expect(dialog.locator("[data-count]")).toHaveText(/\d+ \/ \d+/);
  await expect
    .poll(() =>
      dialog
        .locator("img")
        .evaluate((e) => (e as HTMLImageElement).naturalWidth),
    )
    .toBe(1440);
  await dialog.locator("[data-native]").click();
  await expect(dialog.locator("img")).toHaveCSS("width", "1440px");
  const original = await dialog.locator("[data-original]").getAttribute("href");
  expect((await request.get(original!)).ok()).toBeTruthy();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.locator("img")).toHaveAttribute("src", /impact\.png$/);
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.locator("img")).toHaveAttribute(
    "src",
    /requirement\.png$/,
  );
  await page.keyboard.press("Escape");
  await expect(frame).toBeFocused();
  await expect(dialog).not.toBeVisible();
});

test("deep links, language and browser history retain the selected case chapter", async ({
  page,
}) => {
  await page.goto("projects/personal/nexora/#requirements");
  await expect(page.locator("#requirements")).toBeInViewport();
  await page.getByRole("link", { name: "English version" }).click();
  await expect(page).toHaveURL(
    /en\/projects\/personal\/nexora\/#requirements$/,
  );
  await expect(page.locator("#requirements")).toBeInViewport();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".switcher summary").click();
  const y = await page.evaluate(() => scrollY);
  await page.locator(".switcher a").filter({ hasText: "Flowent" }).click();
  await expect(page.locator("h1")).toHaveText("Flowent");
  await page.goBack();
  await expect(page).toHaveURL(/nexora\/#requirements$/);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(y - 100);
  await page.goForward();
  await expect(page.locator("h1")).toHaveText("Flowent");
});

test("mobile gallery fits viewport and returns focus with no document overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    baseURL: process.env.PORTFOLIO_URL ?? "http://127.0.0.1:44111/portfolio/",
  });
  const page = await context.newPage();
  await page.goto("projects/personal/flowent/");
  const image = page.locator("#showcase [data-gallery]").first();
  await image.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect
    .poll(() =>
      dialog
        .locator("img")
        .evaluate((e) => (e as HTMLImageElement).naturalWidth),
    )
    .toBe(1600);
  await dialog.locator("[data-native]").click();
  await expect(dialog.locator("img")).toHaveCSS("width", "800px");
  await dialog.locator("[data-fit]").click();
  expect(await dialog.evaluate((e) => e.scrollWidth)).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");
  await expect(image).toBeFocused();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await context.close();
});
