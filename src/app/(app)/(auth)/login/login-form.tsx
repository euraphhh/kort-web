"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AppleIcon, GoogleIcon } from "@/components/ui/brand-icons";
import { Button } from "@/components/ui/button";
import { AlertIcon } from "@/components/ui/icons";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [provider, setProvider] = useState<"Google" | "Apple" | null>(null);

  return (
    <div className="mt-(--space-6) flex flex-col gap-(--space-5)">
      {/* Visual only for now: social login is not part of the MVP spec and is not wired. */}
      <div className="flex flex-col gap-(--space-3)">
        <Button
          variant="secondary"
          block
          icon={<GoogleIcon className="size-(--space-5)" />}
          onClick={() => setProvider("Google")}
        >
          Continuar com Google
        </Button>
        <Button
          variant="secondary"
          block
          icon={<AppleIcon className="size-(--space-5)" />}
          onClick={() => setProvider("Apple")}
        >
          Continuar com Apple
        </Button>
        {provider && (
          <p role="status" className="flex items-start gap-(--space-2) text-caption font-medium text-text-muted">
            <AlertIcon className="size-icon-ui shrink-0" />
            <span>Entrar com {provider} ainda não está disponível. Use seu e-mail e senha.</span>
          </p>
        )}
      </div>

      <div className="flex items-center gap-(--space-3) text-caption text-text-muted">
        <span aria-hidden="true" className="flex-1 border-t border-border" />
        <span>ou entre com e-mail</span>
        <span aria-hidden="true" className="flex-1 border-t border-border" />
      </div>

      <form action={formAction} noValidate className="flex flex-col gap-(--space-5)">
        <TextField
          name="email"
          label="E-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="Ex.: nome@barbearia.com"
          defaultValue={state.email}
          error={state.fieldErrors?.email}
        />
        <div className="flex flex-col gap-(--space-1)">
          <PasswordField
            name="password"
            label="Senha"
            autoComplete="current-password"
            error={state.fieldErrors?.password}
          />
          <Link
            href="/forgot-password"
            className="inline-flex min-h-target-min items-center self-end rounded-md text-caption font-semibold text-accent hover:text-accent-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Esqueci minha senha
          </Link>
        </div>

        {state.formError && (
          <p role="alert" className="flex items-start gap-(--space-2) text-caption font-medium text-danger">
            <AlertIcon className="size-icon-ui shrink-0" />
            <span>{state.formError}</span>
          </p>
        )}

        <Button type="submit" block disabled={pending} aria-busy={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
