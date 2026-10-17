"use client";
import { motion } from "motion/react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Linha de título com máscara: o texto sobe de dentro de uma janela. */
export function MaskLine({
  children,
  delay = 0,
  className,
  inView = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  if (!inView) {
    return (
      <span className={`mask ${className ?? ""}`}>
        <span className="mask-in mask-in-css" style={{ ["--d" as string]: `${delay}s` }}>
          {children}
        </span>
      </span>
    );
  }
  const variants = {
    hidden: { y: "112%" },
    show: { y: 0, transition: { duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] as const } },
  };
  // O gatilho fica no invólucro (visível); o texto, dentro da janela com overflow, só se move.
  return (
    <motion.span
      className={`mask ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
    >
      <motion.span className="mask-in" variants={variants}>
        {children}
      </motion.span>
    </motion.span>
  );
}
