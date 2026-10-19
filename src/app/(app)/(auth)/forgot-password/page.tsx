import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Esqueci minha senha | kort",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section aria-labelledby="forgot-title" className="w-full max-w-[calc(var(--space-9)*4)]">
      <h1 id="forgot-title" className="text-display text-text">
        Esqueci minha senha
      </h1>
      <p className="mt-(--space-2) text-lead text-text-muted">
        Informe o e-mail da sua conta e enviamos um link para criar uma nova senha.
      </p>
      <ForgotPasswordForm />
    </section>
  );
}
