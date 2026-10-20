import { expect, test, type Page } from "@playwright/test";

// Needs the local Supabase with supabase/seed.sql applied and the app pointing at it
// (see supabase/README.md). Run with E2E_AUTH=1; skipped otherwise.
test.skip(!process.env.E2E_AUTH, "set E2E_AUTH=1 with Supabase running and the seed applied");

async function login(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("kort-dev-123");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.waitForURL("**/agenda");
}

// Desktop shows the side nav, phone the tab bar: pick the visible one.
const visibleNav = (page: Page) => page.locator("nav[aria-label='Principal']:visible");

test.describe("panel (logged in)", () => {
  test("the owner sees the whole menu and the barbershop name", async ({ page, isMobile }) => {
    await login(page, "dono@kort.dev");
    await expect(page.getByRole("heading", { level: 1, name: "Agenda" })).toBeVisible();
    const links = visibleNav(page).getByRole("link");
    if (isMobile) {
      await expect(links).toHaveText(["Agenda", "A fechar", "Clientes"]);
      await page.getByRole("button", { name: "Mais" }).click();
      for (const name of ["Serviços", "Equipe", "Configurações", "Perfil"]) {
        await expect(page.getByRole("link", { name })).toBeVisible();
      }
    } else {
      await expect(links).toHaveText(["Agenda", "A fechar", "Clientes", "Serviços", "Equipe", "Configurações", "Perfil"]);
      await expect(page.locator("aside").getByText("Barbearia Demo")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });

  test("the barber sees agenda, to close and profile, and is sent home from owner screens", async ({ page, isMobile }) => {
    await login(page, "barbeiro@kort.dev");
    if (!isMobile) await expect(visibleNav(page).getByRole("link")).toHaveText(["Agenda", "A fechar", "Perfil"]);
    for (const path of ["/customers", "/services", "/team", "/settings"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/agenda$/);
    }
    await page.goto("/profile");
    await expect(page.getByRole("heading", { level: 1, name: "Perfil" })).toBeVisible();
  });

  test("marks the current page and is usable by keyboard", async ({ page, isMobile }) => {
    await login(page, "dono@kort.dev");
    await expect(visibleNav(page).getByRole("link", { name: "Agenda" })).toHaveAttribute("aria-current", "page");

    // On a freshly opened page the skip link is the first stop and jumps to the content.
    await page.goto("/agenda");
    await expect(page.getByRole("heading", { level: 1, name: "Agenda" })).toBeVisible();
    await page.waitForTimeout(500); // let hydration finish, so the first Tab is not lost
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#content$/);

    // Every control in the nav shows a 2px focus ring when focused by keyboard.
    const controls = isMobile
      ? visibleNav(page).locator("a, button")
      : page.locator("aside").locator("a, button");
    const count = await controls.count();
    expect(count).toBeGreaterThan(2);
    for (let i = 0; i < count; i++) {
      await controls.nth(i).focus();
      const width = await controls.nth(i).evaluate((el) => getComputedStyle(el).outlineWidth);
      expect(width).toBe("2px");
    }
  });

  test("signing out returns to the login and closes the panel", async ({ page, isMobile }) => {
    await login(page, "dono@kort.dev");
    if (isMobile) await page.getByRole("button", { name: "Mais" }).click();
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/agenda");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("a wrong password gets one generic message", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail", { exact: true }).fill("dono@kort.dev");
    await page.getByLabel("Senha", { exact: true }).fill("errada");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByRole("region", { name: "Entrar" }).getByRole("alert")).toContainText(
      "E-mail ou senha incorretos",
    );
  });
});
