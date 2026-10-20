"use server";

import { validateForgotPassword } from "@/lib/auth/forgot-password-validation";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  if (!supabase) {
    return { email: result.email, error: "Recuperar a senha não está disponível neste ambiente." };
  }

  // Supabase answers the same for an unknown e-mail, so the screen never reveals whether the
  // account exists. The link in the e-mail comes from the template (supabase/templates/recovery.html).
  const { error } = await supabase.auth.resetPasswordForEmail(result.email);
  if (error) {
    // Only failures that do not depend on the account: rate limit and a mail that could not leave.
    return {
      email: result.email,
      error:
        error.status === 429
          ? "Muitos pedidos seguidos. Espere um minuto e tente de novo."
          : "Não foi possível enviar o e-mail agora. Tente de novo em instantes.",
    };
  }

  return { email: result.email, sent: true };
}
