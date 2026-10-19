// Validation of the login form. The messages say what to do ("Informe..."), never just "invalid".
// The panel foundation card replaces this with the shared Zod schemas.

export type LoginErrors = { email?: string; password?: string };

export type LoginValidation =
  | { ok: true; email: string; password: string }
  | { ok: false; email: string; errors: LoginErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LOGIN_MESSAGES = {
  emailRequired: "Informe seu e-mail.",
  emailInvalid: "Informe um e-mail válido, como nome@barbearia.com.",
  passwordRequired: "Informe sua senha.",
} as const;

export function validateLogin(input: { email: unknown; password: unknown }): LoginValidation {
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const errors: LoginErrors = {};

  if (!email) errors.email = LOGIN_MESSAGES.emailRequired;
  else if (!EMAIL.test(email)) errors.email = LOGIN_MESSAGES.emailInvalid;

  if (!password) errors.password = LOGIN_MESSAGES.passwordRequired;

  return Object.keys(errors).length > 0 ? { ok: false, email, errors } : { ok: true, email, password };
}
