import { expect, test } from "@playwright/test";

test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  const email = (page: import("@playwright/test").Page) => page.getByLabel("E-mail", { exact: true });
  const password = (page: import("@playwright/test").Page) => page.getByLabel("Senha", { exact: true });
  const submit = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Entrar", exact: true });

  test("has a single h1, labelled fields and no horizontal scroll", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: "Entrar" })).toBeVisible();
    await expect(email(page)).toBeVisible();
    await expect(password(page)).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("is not indexed", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("shows the brand and the way in", async ({ page }) => {
    await expect(page.getByText("chamou, agendou.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuar com Google" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuar com Apple" })).toBeVisible();
    await expect(page.getByText("ou entre com e-mail")).toBeVisible();
  });

  test("asks for the missing fields, in words", async ({ page }) => {
    await submit(page).click();
    await expect(page.getByText("Informe seu e-mail.")).toBeVisible();
    await expect(page.getByText("Informe sua senha.")).toBeVisible();
    await expect(email(page)).toHaveAttribute("aria-invalid", "true");
    await expect(password(page)).toHaveAttribute("aria-invalid", "true");
  });

  test("explains an invalid e-mail and keeps what was typed", async ({ page }) => {
    await email(page).fill("sem-arroba");
    await password(page).fill("segredo");
    await submit(page).click();
    await expect(page.getByText("Informe um e-mail válido, como nome@barbearia.com.")).toBeVisible();
    await expect(email(page)).toHaveValue("sem-arroba");
  });

  test("shows a form error for a login that fails, without clearing the e-mail", async ({ page }) => {
    await email(page).fill("dono@barbearia.com");
    await password(page).fill("segredo");
    await submit(page).click();
    // Next.js has its own role="alert" (route announcer), so scope this to the login section.
    await expect(page.getByRole("region", { name: "Entrar" }).getByRole("alert")).toContainText(
      // Without Supabase in the environment: "não está disponível"; with it: wrong credentials.
      /Entrar não está disponível|E-mail ou senha incorretos/,
    );
    await expect(email(page)).toHaveValue("dono@barbearia.com");
  });

  test("shows and hides the password, saying which state it is in", async ({ page }) => {
    await password(page).fill("segredo");
    await expect(password(page)).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Mostrar senha" }).click();
    await expect(password(page)).toHaveAttribute("type", "text");
    await expect(password(page)).toHaveValue("segredo");
    await expect(page.getByRole("button", { name: "Ocultar senha" })).toHaveAttribute("aria-pressed", "true");
  });

  test("social login is visual only and says so", async ({ page }) => {
    await page.getByRole("button", { name: "Continuar com Google" }).click();
    await expect(page.getByRole("status")).toContainText("Entrar com Google ainda não está disponível");
    await page.getByRole("button", { name: "Continuar com Apple" }).click();
    await expect(page.getByRole("status")).toContainText("Entrar com Apple ainda não está disponível");
  });

  test("is usable by keyboard, with a visible focus ring on every control", async ({ page }) => {
    const order = [
      "Continuar com Google",
      "Continuar com Apple",
      "E-mail",
      "Senha",
      "Mostrar",
      "Esqueci minha senha",
      "Entrar",
    ];
    for (const name of order) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();
      const label = await focused.evaluate(
        (el) => (el as HTMLInputElement).labels?.[0]?.textContent ?? el.textContent ?? "",
      );
      expect(label.trim()).toBe(name);
      const outline = await focused.evaluate((el) => {
        const style = getComputedStyle(el);
        return { style: style.outlineStyle, width: style.outlineWidth };
      });
      expect(outline.style).not.toBe("none");
      expect(outline.width).toBe("2px");
    }
  });

  test("the recovery link points to /forgot-password", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Esqueci minha senha" })).toHaveAttribute("href", "/forgot-password");
  });
});
