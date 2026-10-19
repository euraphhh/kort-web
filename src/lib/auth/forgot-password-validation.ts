// Validation of the "forgot password" form: only the e-mail. Same messages as the login form.
import { LOGIN_MESSAGES, validateLogin } from "./login-validation";

export type ForgotPasswordValidation = { ok: true; email: string } | { ok: false; email: string; error: string };

export function validateForgotPassword(input: { email: unknown }): ForgotPasswordValidation {
  // The password is irrelevant here: reuse the e-mail rules by passing a placeholder.
  const result = validateLogin({ email: input.email, password: "x" });
  if (result.ok) return { ok: true, email: result.email };
  return { ok: false, email: result.email, error: result.errors.email ?? LOGIN_MESSAGES.emailRequired };
}
