"use server";

import { redirect } from "next/navigation";
import { homePath } from "@/lib/auth/access";
import { validateNewPassword, type PasswordErrors } from "@/lib/auth/password-validation";
import { createClient } from "@/lib/supabase/server";

export type ResetPasswordState = {
  fieldErrors?: PasswordErrors;
  formError?: string;
  /** The recovery session is gone (link used twice, or expired while the screen was open). */
  expired?: boolean;
};

export async function resetPassword(_previous: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const result = validateNewPassword({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!result.ok) return { fieldErrors: result.errors };

  const supabase = await createClient();
  if (!supabase) return { formError: "Redefinir a senha não está disponível neste ambiente." };

  const { data } = await supabase.auth.getUser();
  if (!data.user) return { expired: true };

  const { error } = await supabase.auth.updateUser({ password: result.password });
  if (error) {
    if (error.code === "same_password") {
      return { fieldErrors: { password: "Use uma senha diferente da atual." } };
    }
    if (error.code === "weak_password") {
      return {
        fieldErrors: {
          password: "Escolha uma senha mais forte: 8 caracteres, com maiúscula, minúscula, número e símbolo.",
        },
      };
    }
    return { formError: "Não foi possível salvar a senha agora. Tente de novo em instantes." };
  }

  redirect(homePath());
}
