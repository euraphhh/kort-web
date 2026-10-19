import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Entrar | kort",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <section aria-labelledby="login-title" className="w-full max-w-[calc(var(--space-9)*4)]">
      <h1 id="login-title" className="text-display text-text">
        Entrar
      </h1>
      <p className="mt-(--space-2) text-lead text-text-muted">Acesse o painel da sua barbearia.</p>
      <LoginForm />
      <p className="mt-(--space-6) text-caption text-text-muted">
        Primeiro acesso? Use o link de convite que o dono da barbearia enviou.
      </p>
    </section>
  );
}
