import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

// Full recovery flow against the local Supabase: the e-mail is read from Mailpit, and a throwaway
// user is created (and deleted) through the admin API. Needs `npx supabase start`, the app pointing
// at it, and the local secret key:
//   E2E_AUTH=1 E2E_SUPABASE_SECRET_KEY=<secret key printed by supabase start> npx playwright test tests/e2e/password-recovery.spec.ts
// Skipped otherwise.
const SUPABASE_URL = process.env.E2E_SUPABASE_URL ?? "http://127.0.0.1:54321";
const MAILPIT_URL = process.env.E2E_MAILPIT_URL ?? "http://127.0.0.1:54324";
const SECRET_KEY = process.env.E2E_SUPABASE_SECRET_KEY;

test.skip(!process.env.E2E_AUTH || !SECRET_KEY, "set E2E_AUTH=1 and E2E_SUPABASE_SECRET_KEY with Supabase running");

const OLD_PASSWORD = "Antiga@2026";
const NEW_PASSWORD = "Nova@2026!";

const admin = { apikey: SECRET_KEY ?? "", Authorization: `Bearer ${SECRET_KEY ?? ""}` };

async function createUser(request: APIRequestContext, email: string): Promise<string> {
  const response = await request.post(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: admin,
    data: { email, password: OLD_PASSWORD, email_confirm: true },
  });
  expect(response.ok(), await response.text()).toBe(true);
  return (await response.json()).id;
}

async function recoveryLink(request: APIRequestContext, email: string): Promise<string> {
  for (let attempt = 0; attempt < 30; attempt++) {
    const list = await request.get(`${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`);
    const messages = (await list.json()).messages ?? [];
    if (messages.length > 0) {
      const message = await (await request.get(`${MAILPIT_URL}/api/v1/message/${messages[0].ID}`)).json();
      const match = /href="([^"]*\/auth\/confirm[^"]*)"/.exec(message.HTML as string);
      expect(match, "the e-mail has the recovery link").not.toBeNull();
      return (match as RegExpExecArray)[1].replaceAll("&amp;", "&");
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`no e-mail for ${email} in Mailpit`);
}

async function requestReset(page: Page, email: string) {
  await page.goto("/forgot-password");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Enviar link" }).click();
  await expect(page.getByRole("status")).toContainText("Pedido enviado");
}

test.describe("password recovery", () => {
  let email: string;
  let userId: string;

  test.beforeEach(async ({ request }, testInfo) => {
    email = `recover-${testInfo.project.name}-${Date.now()}@test.kort`;
    userId = await createUser(request, email);
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, { headers: admin });
  });

  test("sends the e-mail, sets a new password and the link works only once", async ({ page, request }) => {
    await requestReset(page, email);
    const link = await recoveryLink(request, email);

    await page.goto(link);
    await expect(page).toHaveURL(/\/reset-password$/);
    await expect(page.getByRole("heading", { level: 1, name: "Criar nova senha" })).toBeVisible();

    // Each requirement has its own line, with a word (not just a color), and follows the typing.
    const rules = page.getByRole("list", { name: "Requisitos da senha" }).getByRole("listitem");
    await expect(rules).toHaveCount(5);
    for (const rule of await rules.all()) await expect(rule).toContainText("pendente");
    await page.getByLabel("Nova senha", { exact: true }).fill("Abcdefg1");
    await expect(rules.filter({ hasText: "Um símbolo" })).toContainText("pendente");
    for (const name of ["8 caracteres", "maiúscula", "minúscula", "número"]) {
      await expect(rules.filter({ hasText: name })).toContainText("atendido");
    }
    await page.getByLabel("Nova senha", { exact: true }).fill("Abcdefg1!");
    for (const rule of await rules.all()) await expect(rule).toContainText("atendido");

    // The rules say what is missing, in words.
    await page.getByLabel("Nova senha", { exact: true }).fill("curta");
    await page.getByLabel("Repita a nova senha").fill("curta");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();
    await expect(page.getByText("Use pelo menos 8 caracteres.")).toBeVisible();

    await page.getByLabel("Nova senha", { exact: true }).fill("semsimbolo1A");
    await page.getByLabel("Repita a nova senha").fill("semsimbolo1A");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();
    await expect(page.getByText("Falta símbolo.")).toBeVisible();

    await page.getByLabel("Nova senha", { exact: true }).fill(NEW_PASSWORD);
    await page.getByLabel("Repita a nova senha").fill("Outra@2026!");
    await page.getByRole("button", { name: "Salvar nova senha" }).click();
    await expect(page.getByText("As senhas não são iguais")).toBeVisible();

    // After an error the typed passwords stay on the screen (they never leave the browser); type them again anyway.
    await page.getByLabel("Nova senha", { exact: true }).fill(NEW_PASSWORD);
    await page.getByLabel("Repita a nova senha").fill(NEW_PASSWORD);
    await page.getByRole("button", { name: "Salvar nova senha" }).click();
    // The throwaway user has no barbershop, so the panel sends it to /login: it proves the save went through.
    await expect(page).toHaveURL(/\/login$/);

    // The new password is the one that works now.
    await page.getByLabel("E-mail", { exact: true }).fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(OLD_PASSWORD);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByRole("region", { name: "Entrar" }).getByRole("alert")).toContainText(
      "E-mail ou senha incorretos",
    );
    await page.getByLabel("Senha", { exact: true }).fill(NEW_PASSWORD);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page.getByRole("region", { name: "Entrar" }).getByRole("alert")).toContainText(
      "Esta conta não tem acesso a uma barbearia",
    );

    // A used link explains itself and offers a new one.
    await page.context().clearCookies();
    await page.goto(link);
    await expect(page).toHaveURL(/\/reset-password\?link=invalid$/);
    await expect(page.getByRole("alert").filter({ hasText: "expirou ou já foi usado" })).toBeVisible();
    await page.getByRole("link", { name: "Pedir um novo link" }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test("a forged link and a visit without a link both explain and offer a new one", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=forjado&type=recovery");
    await expect(page).toHaveURL(/\/reset-password\?link=invalid$/);
    await expect(page.getByRole("alert").filter({ hasText: "expirou ou já foi usado" })).toBeVisible();

    await page.goto("/reset-password");
    await expect(page.getByRole("alert").filter({ hasText: "expirou ou já foi usado" })).toBeVisible();
  });

  test("an unknown e-mail gets the same answer as a real one", async ({ page }) => {
    await requestReset(page, `ninguem-${Date.now()}@test.kort`);
  });

  test("the destination of the link is fixed, whatever the URL says", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=x&type=recovery&next=https://exemplo.com/roubo");
    await expect(page).toHaveURL(/localhost:3000\/reset-password\?link=invalid$/);
  });
});
