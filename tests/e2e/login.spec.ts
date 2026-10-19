import { expect, test } from "@playwright/test";

test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("has a single h1, labelled fields and no horizontal scroll", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: "Entrar" })).toBeVisible();
    await expect(page.getByLabel("E-mail")).toBeVisible();
    await expect(page.getByLabel("Senha")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("is not indexed", async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("asks for the missing fields, in words", async ({ page }) => {
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Informe seu e-mail.")).toBeVisible();
    await expect(page.getByText("Informe sua senha.")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Senha")).toHaveAttribute("aria-invalid", "true");
  });

  test("explains an invalid e-mail and keeps what was typed", async ({ page }) => {
    await page.getByLabel("E-mail").fill("sem-arroba");
    await page.getByLabel("Senha").fill("segredo");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.getByText("Informe um e-mail válido, como nome@barbearia.com.")).toBeVisible();
    await expect(page.getByLabel("E-mail")).toHaveValue("sem-arroba");
  });

  test("says login is not available yet, without clearing the e-mail", async ({ page }) => {
    await page.getByLabel("E-mail").fill("dono@barbearia.com");
    await page.getByLabel("Senha").fill("segredo");
    await page.getByRole("button", { name: "Entrar" }).click();
    // Next.js has its own role="alert" (route announcer), so scope this to the login card.
    await expect(page.getByRole("region", { name: "Entrar" }).getByRole("alert")).toContainText(
      "Entrar ainda não está disponível",
    );
    await expect(page.getByLabel("E-mail")).toHaveValue("dono@barbearia.com");
  });

  test("is usable by keyboard, with a visible focus ring on every control", async ({ page }) => {
    const order = ["E-mail", "Senha", "Entrar", "Esqueci minha senha"];
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
