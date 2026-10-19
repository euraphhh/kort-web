import { expect, test } from "@playwright/test";

// Without a session, every panel route goes to /login. (The logged-in layout needs Supabase and is
// checked by hand with the seed users in supabase/seed.sql.)
const PANEL_ROUTES = ["/agenda", "/to-close", "/customers", "/services", "/team", "/settings", "/profile"];

test.describe("panel guard", () => {
  for (const route of PANEL_ROUTES) {
    test(`${route} redirects to /login without a session`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole("heading", { level: 1, name: "Entrar" })).toBeVisible();
    });
  }

  test("nested panel paths are guarded too", async ({ page }) => {
    await page.goto("/customers/123");
    await expect(page).toHaveURL(/\/login$/);
  });
});
