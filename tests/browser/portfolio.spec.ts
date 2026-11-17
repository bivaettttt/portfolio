import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const featured = ["traceon", "nexora", "flowent"];
const all = [
  ...featured,
  "vaultix",
  "credence",
  "sentrix",
  "wayline",
  "quantara",
  "veridion",
];
for (const width of [1920, 1440, 1280, 1024, 768, 390, 320]) {
  test("document reflow at " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 870 });
    for (const path of [
      "./",
      "projects/",
      "projects/personal/",
      "profile/",
      "contact/",
      "projects/personal/flowent/",
      "en/",
    ]) {
      const response = await page.goto(path);
      expect(response?.ok(), path).toBeTruthy();
      await expect(page.locator("main h1")).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        path,
      ).toBeLessThanOrEqual(width);
    }
  });
}
test("recruiter navigates home, catalogue, language and profile", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("response", (r) => {
    if (r.status() >= 400 && r.url().includes("/portfolio/"))
      errors.push(r.url());
  });
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Тимур Надршин",
  );
  await page.getByRole("link", { name: "Смотреть проекты" }).click();
  await expect(page.locator(".folders > a")).toHaveCount(3);
  await page.getByRole("link", { name: /Личные проекты/ }).click();
  await expect(page.locator(".feature")).toHaveCount(3);
  await expect(page.locator(".project-row")).toHaveCount(6);
  await page.locator(".feature").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Traceon");
  await page.getByRole("link", { name: "English version" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Traceon");
  await page.getByRole("link", { name: "Profile", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /résumé on HH.ru/i }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("analyst reviews a requirement, filters operations and uses image dialog from keyboard", async ({
  page,
}) => {
  await page.goto("projects/personal/flowent/");
  await page.locator("#requirements summary").first().press("Enter");
  await expect(
    page.getByText("Публикация относится к сохранённому XML и редакции."),
  ).toBeVisible();
  await page.getByText("Исследовать операции OpenAPI").click();
  const filter = page.getByRole("searchbox");
  await filter.fill("nothing-matches");
  await expect(page.getByRole("status")).toHaveText("Совпадений нет.");
  await filter.fill("/api");
  await expect(page.locator("[data-endpoint]:visible").first()).toBeVisible();
  const image = page.locator("[data-gallery]").first();
  await image.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Увеличить" }).press("Enter");
  await expect(dialog.locator("img")).toHaveAttribute("style", /125%/);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(image).toBeFocused();
});
test("all independent cases show media and offer verification", async ({
  page,
}) => {
  for (const id of all) {
    await page.goto("projects/personal/" + id + "/");
    const hero = page.getByRole("heading", { level: 1 });
    await expect(hero).toHaveText(new RegExp(id, "i"));
    await expect(page.locator("#requirements details")).toHaveCount(2);
    const image = page.locator("#showcase img").first();
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
});
test("theme persists across navigation and reduced motion is respected", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  const theme = page.getByRole("button", { name: "Тёмная тема" });
  await theme.press("Enter");
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Проекты", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page).toHaveURL(/\/portfolio\/projects\/$/);
  await expect(page.locator(".folder-front")).toHaveCount(3);
  await page.reload();
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator(".folder-front")
      .first()
      .evaluate((e) => parseFloat(getComputedStyle(e).transitionDuration)),
  ).toBeLessThan(0.01);
});
test("WCAG scan of representative routes in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const route of [
      "./",
      "projects/",
      "projects/personal/traceon/",
      "projects/practice/merch/",
      "en/profile/",
      "contact/",
    ]) {
      await page.goto(route);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        scheme + " " + route,
      ).toEqual([]);
    }
  }
});
