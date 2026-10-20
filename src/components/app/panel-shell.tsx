import { Wordmark } from "@/components/ui/wordmark";
import { navFor } from "@/lib/auth/access";
import { requireSession } from "@/lib/auth/session";
import { SideActions, SideNav, TabBar } from "./panel-nav";

// Frame of every panel screen: side bar on the desktop, top bar and bottom tab bar on the phone.
// Separated by border, never by shadow. The screens (and the states of the "Estados do painel"
// card: empty, loading, error, 404) render inside <main>.

export async function PanelShell({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const items = navFor(session.role);
  const roleLabel = session.role === "owner" ? "Dono" : "Barbeiro";

  return (
    <div className="min-h-dvh bg-bg text-text md:grid md:grid-cols-[calc(var(--space-9)*2.5)_1fr]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-(--space-2) focus:left-(--space-2) focus:z-20 focus:rounded-md focus:bg-surface-1 focus:px-(--space-4) focus:py-(--space-3) focus:text-body-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Pular para o conteúdo
      </a>

      <aside className="hidden flex-col justify-between gap-(--space-6) border-r border-border bg-surface-1 p-(--space-5) md:sticky md:top-0 md:flex md:h-dvh">
        <div className="flex flex-col gap-(--space-6)">
          <Wordmark className="w-(--space-9) text-text" />
          <SideNav items={items} />
        </div>
        <div className="flex flex-col gap-(--space-4)">
          <div className="flex flex-col gap-(--space-1) px-(--space-3)">
            {session.barbershopName && <p className="text-body-strong">{session.barbershopName}</p>}
            <p className="text-small text-text-muted">{roleLabel}</p>
            <p className="text-small break-all text-text-muted">{session.email}</p>
          </div>
          <SideActions />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-(--space-3) border-b border-border bg-surface-1 px-(--space-4) py-(--space-3) md:hidden">
          <Wordmark className="w-(--space-9) text-text" />
          <p className="text-small truncate text-text-muted">{session.barbershopName ?? roleLabel}</p>
        </header>
        <main
          id="content"
          tabIndex={-1}
          className="flex-1 px-(--space-4) pt-(--space-6) pb-[calc(var(--space-9)*1.25)] md:px-(--space-7) md:pb-(--space-7)"
        >
          {children}
        </main>
      </div>

      <TabBar items={items} />
    </div>
  );
}

/** Shown while the session loads (with cache components the session is runtime data, so it streams). */
export function PanelShellSkeleton() {
  return <div className="min-h-dvh bg-bg" aria-busy="true" />;
}
