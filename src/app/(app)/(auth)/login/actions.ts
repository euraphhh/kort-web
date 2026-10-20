"use server";

import { redirect } from "next/navigation";
import { homePath } from "@/lib/auth/access";
import { validateLogin, type LoginErrors } from "@/lib/auth/login-validation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  /** What the person typed, so a failed attempt does not clear the e-mail. Never the password. */
  email?: string;
  fieldErrors?: LoginErrors;
  formError?: string;
};

// One message for a wrong e-mail and a wrong password: never say whether the account exists.
const BAD_CREDENTIALS = "E-mail ou senha incorretos. Confira e tente de novo.";

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const result = validateLogin({ email: formData.get("email"), password: formData.get("password") });
  if (!result.ok) return { email: result.email, fieldErrors: result.errors };

  const supabase = await createClient();
  if (!supabase) {
    return { email: result.email, formError: "Entrar não está disponível neste ambiente." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.email,
    password: result.password,
  });
  if (error || !data.user) return { email: result.email, formError: BAD_CREDENTIALS };

  const { data: member } = await supabase
    .from("barbershop_member")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!member) {
    await supabase.auth.signOut();
    return {
      email: result.email,
      formError: "Esta conta não tem acesso a uma barbearia. Peça o link de convite ao dono.",
    };
  }

  redirect(homePath());
}
