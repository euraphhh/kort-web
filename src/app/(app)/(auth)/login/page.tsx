import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar | kort",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section
      aria-labelledby="login-title"
      className="w-full max-w-prose rounded-lg border border-border bg-surface-1 p-(--space-5) md:p-(--space-6)"
    >
      <h1 id="login-title" className="text-heading text-text">
        Entrar
      </h1>
      <p className="mt-(--space-2) mb-(--space-5) text-body text-text-muted">
        Acesse o painel da sua barbearia.
      </p>
      <LoginForm />
    </section>
  );
}
