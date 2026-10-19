import { Wordmark } from "@/components/ui/wordmark";

// Screens for people who are not logged in yet (login and, later, password recovery and invite).
// The brand side is flat color (no shadow or gradient: those are landing-only); on a phone it
// shrinks to a header above the form.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-bg md:grid-cols-2 md:grid-rows-1">
      <aside className="flex flex-col justify-between gap-(--space-6) bg-brand-couro p-(--space-5) text-brand-creme md:p-(--space-8)">
        <Wordmark className="w-[calc(var(--space-9)*1.5)] md:w-[calc(var(--space-9)*2)]" />
        <div className="flex flex-col gap-(--space-4)">
          <p className="text-heading md:text-display-lg">chamou, agendou.</p>
          <p className="hidden max-w-prose text-lead md:block">
            A agenda da sua barbearia e um assistente que marca horário pelo WhatsApp.
          </p>
        </div>
      </aside>
      <main className="flex items-start justify-center px-(--space-4) py-(--space-7) md:items-center md:px-(--space-8)">
        {children}
      </main>
    </div>
  );
}
