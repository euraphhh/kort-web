"use server";

import { validateForgotPassword } from "@/lib/auth/forgot-password-validation";

export type ForgotPasswordState = {
  email?: string;
  error?: string;
  /** The answer is the same whether or not the account exists (spec: do not reveal the e-mail). */
  sent?: boolean;
};

export async function requestPasswordReset(
  _previous: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const result = validateForgotPassword({ email: formData.get("email") });
  if (!result.ok) return { email: result.email, error: result.error };

  // TODO(card "Login e acesso"): call Supabase Auth resetPasswordForEmail here (e-mail via Resend).
  // Never branch the response on whether the account exists.
  return { email: result.email, sent: true };
}
