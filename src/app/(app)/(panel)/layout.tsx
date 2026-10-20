import { Suspense } from "react";
import { PanelShell, PanelShellSkeleton } from "@/components/app/panel-shell";

// Layout of the logged-in panel. Never shared with marketing; separate from (auth), which is for
// people who are not logged in. Reading the session is runtime data, hence the Suspense boundary.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PanelShellSkeleton />}>
      <PanelShell>{children}</PanelShell>
    </Suspense>
  );
}
