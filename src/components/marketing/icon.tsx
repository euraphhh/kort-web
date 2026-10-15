import type { LucideIcon } from "lucide-react";

/** Ícone Lucide no estilo do design system: traço 1,8px, currentColor, decorativo. */
export function Icon({ icon: Glyph, className = "size-icon-ui" }: { icon: LucideIcon; className?: string }) {
  return <Glyph className={`flex-none ${className}`} strokeWidth={1.8} aria-hidden="true" />;
}
