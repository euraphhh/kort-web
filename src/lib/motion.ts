import type { Transition } from "motion/react";
import { motionTokens as t } from "./motion-tokens";

/** Fade + deslocamento ao entrar na tela. Uma vez só. */
export const reveal = {
  initial: { opacity: 0, transform: `translateY(${t.distanceReveal}px)` },
  whileInView: { opacity: 1, transform: "translateY(0px)" },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: t.durationReveal, ease: t.easeOut } satisfies Transition,
} as const;

/** Balão de conversa e cartão da agenda no hero. */
export const enter = {
  hidden: {
    opacity: 0,
    transform: `translateY(${t.distanceBubble}px)`,
    transition: { duration: t.durationFast, ease: t.easeOut },
  },
  shown: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: t.durationEnter, ease: t.easeOut },
  },
} as const;

/** Intervalo entre itens de um grupo (máximo 4 itens escalonados). */
export const staggerDelay = (index: number) => Math.min(index, 3) * t.stagger;

// ---------- Linha do tempo da conversa do hero ----------

export type ChatLine = { from: "client" | "assistant"; text: string };

export type ChatEvent = {
  /** Segundos desde o início. */
  at: number;
  /** Quantas mensagens já estão visíveis (lines.length + 1 = cartão da agenda). */
  step: number;
  /** Índice da mensagem que o assistente está "digitando", ou null. */
  typing: number | null;
};

/** Ritmo da conversa, em segundos. Proporcional ao tamanho das mensagens. */
const chatPace = {
  start: 0.4,
  clientPause: 0.7,
  assistantPause: 0.4,
  readPerChar: 0.01,
  readMax: 1.2,
  typingMin: 0.6,
  typingPerChar: 0.012,
  typingMax: 1.4,
  agendaDelay: 0.6,
  replayDelay: 0.8,
} as const;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function buildChatTimeline(lines: readonly ChatLine[]) {
  const events: ChatEvent[] = [];
  let at = chatPace.start;

  lines.forEach((line, i) => {
    if (line.from === "assistant") {
      events.push({ at, step: i, typing: i });
      at += clamp(line.text.length * chatPace.typingPerChar, chatPace.typingMin, chatPace.typingMax);
    }
    events.push({ at, step: i + 1, typing: null });

    const next = lines[i + 1];
    if (next?.from === "client") {
      at += chatPace.clientPause + Math.min(line.text.length * chatPace.readPerChar, chatPace.readMax);
    } else if (next?.from === "assistant") {
      at += chatPace.assistantPause;
    }
  });

  at += chatPace.agendaDelay;
  events.push({ at, step: lines.length + 1, typing: null });

  return { events, doneAt: at + chatPace.replayDelay };
}
