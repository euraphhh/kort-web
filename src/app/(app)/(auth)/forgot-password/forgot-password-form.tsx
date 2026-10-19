"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { TextField } from "@/components/ui/text-field";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";

const initialState: ForgotPasswordState = {};

const linkClass =
  "inline-flex min-h-target-min items-center rounded-md text-caption font-semibold text-accent hover:text-accent-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.sent) {
    return (
      <div className="mt-(--space-6) flex flex-col gap-(--space-5)">
        <div
          role="status"
          className="flex items-start gap-(--space-3) rounded-lg border border-border bg-surface-1 p-(--space-5) text-body text-text"
        >
          <CheckIcon className="size-icon-ui shrink-0 text-state-confirmed" />
          <p>
            Pedido enviado. Se <strong className="font-semibold">{state.email}</strong> tiver uma conta, você vai
            receber um link para criar uma nova senha. Olhe também o spam.
          </p>
        </div>
        <Link href="/login" className={`${linkClass} self-start`}>
          Voltar para entrar
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="mt-(--space-6) flex flex-col gap-(--space-5)">
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
        error={state.error}
      />
      <Button type="submit" block disabled={pending} aria-busy={pending}>
        {pending ? "Enviando…" : "Enviar link"}
      </Button>
      <Link href="/login" className={`${linkClass} self-start`}>
        Voltar para entrar
      </Link>
    </form>
  );
}
