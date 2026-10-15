"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { reveal, staggerDelay } from "@/lib/motion";

/** Reveal discreto ao rolar. Com movimento reduzido ou sem JS, o conteúdo já aparece pronto. */
export function Reveal({ children, index = 0, className }: { children: ReactNode; index?: number; className?: string }) {
  return (
    <m.div
      data-motion-final
      className={className}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={{ ...reveal.transition, delay: staggerDelay(index) }}
    >
      {children}
    </m.div>
  );
}
