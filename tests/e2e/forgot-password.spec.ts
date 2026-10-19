import { expect, test } from "@playwright/test";

test.describe("forgot password", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
  });

  const email = (page: import("@playwright/test").Page) => page.getByLabel("E-mail", { exact: true });
  const submit = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Enviar link" });

  test("has a single h1, a labelled field and no horizontal scroll", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: "Esqueci minha senha" })).toBeVisible();
    await expect(email(page)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });

  test("is not indexed", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("asks for the e-mail, in words", async ({ page }) => {
    await submit(page).click();
    await expect(page.getByText("Informe seu e-mail.")).toBeVisible();
    await expect(email(page)).toHaveAttribute("aria-invalid", "true");
  });

  test("explains an invalid e-mail and keeps what was typed", async ({ page }) => {
    await email(page).fill("sem-arroba");
    await submit(page).click();
    await expect(page.getByText("Informe um e-mail válido, como nome@barbearia.com.")).toBeVisible();
    await expect(email(page)).toHaveValue("sem-arroba");
  });

  test("gives the same answer without saying whether the account exists", async ({ page }) => {
    await email(page).fill("dono@barbearia.com");
    await submit(page).click();
    const status = page.getByRole("status");
    await expect(status).toContainText("Pedido enviado");
    await expect(status).toContainText("Se dono@barbearia.com tiver uma conta");
  });

  test("goes back to the login", async ({ page }) => {
    await page.getByRole("link", { name: "Voltar para entrar" }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("the login link reaches this screen", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Esqueci minha senha" }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});
