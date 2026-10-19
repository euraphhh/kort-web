"use server";

import { validateLogin, type LoginErrors } from "@/lib/auth/login-validation";

export type LoginState = {
  /** What the person typed, so a failed attempt does not clear the e-mail. Never the password. */
  email?: string;
  fieldErrors?: LoginErrors;
  formError?: string;
};

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const result = validateLogin({ email: formData.get("email"), password: formData.get("password") });
  if (!result.ok) return { email: result.email, fieldErrors: result.errors };

  // TODO(card "Fundação do painel" and "Login e acesso"): sign in with Supabase Auth here, set the
  // session cookie and redirect to the panel. Until then, no one can log in.
  return {
    email: result.email,
    formError: "Entrar ainda não está disponível. Tente de novo em breve.",
  };
}
