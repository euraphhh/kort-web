import { Wordmark } from "@/components/ui/wordmark";

// Screens for people who are not logged in yet (login and, later, password recovery and invite).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-(--space-6) bg-bg px-(--space-4) py-(--space-7)">
      <Wordmark className="w-(--space-9) text-text" />
      {children}
    </main>
  );
}
