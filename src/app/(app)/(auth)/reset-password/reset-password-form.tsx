"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertIcon } from "@/components/ui/icons";
import { PasswordField } from "@/components/ui/password-field";
import { resetPassword, type ResetPasswordState } from "./actions";
import { PasswordChecklist } from "./password-checklist";

const initialState: ResetPasswordState = {};

export function ExpiredLink() {
  return (
    <div className="mt-(--space-6) flex flex-col gap-(--space-5)">
      <div
        role="alert"
        className="flex items-start gap-(--space-3) rounded-lg border border-border bg-surface-1 p-(--space-5) text-body text-text"
      >
        <AlertIcon className="size-icon-ui shrink-0 text-danger" />
        <p>Este link expirou ou já foi usado. Peça um novo para criar sua senha.</p>
      </div>
      <Link
        href="/forgot-password"
        className="inline-flex min-h-target-min items-center self-start rounded-md text-caption font-semibold text-accent hover:text-accent-strong hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Pedir um novo link
      </Link>
    </div>
  );
}

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);
  // Controlled, so the checklist follows the typing and a failed attempt keeps what was typed
  // (the password stays on this device: the action never sends it back).
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  if (state.expired) return <ExpiredLink />;

  return (
    <form action={formAction} noValidate className="mt-(--space-6) flex flex-col gap-(--space-5)">
      <div className="flex flex-col gap-(--space-3)">
        <PasswordField
          name="password"
          label="Nova senha"
          toggleName="nova senha"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={state.fieldErrors?.password}
        />
        <PasswordChecklist password={password} />
      </div>
      <PasswordField
        name="confirmation"
        label="Repita a nova senha"
        toggleName="repetição da senha"
        autoComplete="new-password"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        error={state.fieldErrors?.confirmation}
      />

      {state.formError && (
        <p role="alert" className="flex items-start gap-(--space-2) text-caption font-medium text-danger">
          <AlertIcon className="size-icon-ui shrink-0" />
          <span>{state.formError}</span>
        </p>
      )}

      <Button type="submit" block disabled={pending} aria-busy={pending}>
        {pending ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
