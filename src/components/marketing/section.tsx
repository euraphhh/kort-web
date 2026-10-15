import type { ReactNode } from "react";

/** Faixa de seção: padding lateral space-4 no celular e space-7 no desktop. */
export function Section({
  id,
  labelledBy,
  className = "",
  children,
}: {
  id?: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`px-4 py-8 lg:px-7 lg:py-9 ${className}`}>
      <div className="mx-auto max-w-container">{children}</div>
    </section>
  );
}

export function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="max-w-prose text-title text-balance lg:text-display">
      {children}
    </h2>
  );
}
