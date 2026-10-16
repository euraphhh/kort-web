"use client";
import Image from "next/image";
import { motion } from "motion/react";

const K = "M16 14V100";
const K2 = "M16 78L50 46";
const K3 = "M30 65L52 100";
const O = "M78.2 91.8A28 28 0 1 1 90 98.8";
const TAIL = "M78.2 91.8L76 106L90 98.8";
const R = "M150 100V72Q150 44 176 44H214";
const T = "M196 16V82Q196 100 214 100";

/** Wordmark oficial: o "o" é um balão de conversa e o r emenda no t. Sempre uma cor só (currentColor). */
export function Wordmark({ className, draw = false }: { className?: string; draw?: boolean }) {
  const paths = [K, K2, K3, O, TAIL, R, T];
  return (
    <svg viewBox="0 0 230 120" role="img" aria-label="kort" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
        {paths.map((d, i) =>
          draw ? (
            <motion.path
              key={d}
              d={d}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
          ) : (
            <path key={d} d={d} />
          )
        )}
      </g>
    </svg>
  );
}

/** Ícone oficial (app / avatar), servido do SVG da marca. */
export function Icon({ className }: { className?: string }) {
  return <Image src="/brand/kort-icone.svg" alt="" width={40} height={40} className={className} />;
}
