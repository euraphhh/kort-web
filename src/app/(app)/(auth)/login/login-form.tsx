"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
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
      <TextField
        name="password"
        label="Senha"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
      />

      {state.formError && (
        <p role="alert" className="flex items-start gap-(--space-2) text-caption font-medium text-danger">
          <AlertIcon className="size-icon-ui shrink-0" />
          <span>{state.formError}</span>
        </p>
      )}

      <Button type="submit" block disabled={pending} aria-busy={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>

      <Link
        href="/forgot-password"
        className="inline-flex min-h-target-min items-center justify-center rounded-md text-body-strong text-accent hover:text-accent-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Esqueci minha senha
      </Link>
    </form>
  );
}
