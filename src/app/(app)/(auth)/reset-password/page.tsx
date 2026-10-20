import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ExpiredLink, ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Nova senha | kort",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ link?: string }>;

// The title is static; what depends on the request (is there a recovery session?) streams in.
async function Content({ searchParams }: { searchParams: SearchParams }) {
  const { link } = await searchParams;
  const supabase = await createClient();
  const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (link === "invalid" || !data.user) return <ExpiredLink />;
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <section aria-labelledby="reset-title" className="w-full max-w-[calc(var(--space-9)*4)]">
      <h1 id="reset-title" className="text-display text-text">
        Criar nova senha
      </h1>
      <p className="mt-(--space-2) text-lead text-text-muted">Escolha a senha que você vai usar para entrar.</p>
      <Suspense>
        <Content searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
