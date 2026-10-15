"use client";

import { RotateCcw, SkipForward, Store } from "lucide-react";
import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildChatTimeline, enter, type ChatLine } from "@/lib/motion";
import { AppointmentRow } from "./agenda";
import { Button } from "./button";
import { Icon } from "./icon";

// Conversa do hero: cliente pede, assistente responde, horário cai na agenda.
// Roda uma vez quando o celular aparece. Enquanto roda dá para pular
// (a animação começa sozinha e passa de 5s); no fim, "Ver de novo" repete. Sem loop.
// Todas as mensagens estão no DOM desde o servidor (leitor de tela lê a conversa
// inteira e a moldura tem altura fixa); só a opacidade e o deslocamento mudam.

export type HeroChatContent = {
  shop: string;
  shopStatus: string;
  label: string;
  replay: string;
  skip: string;
  lines: ChatLine[];
  agenda: { title: string; time: string; service: string; client: string; professional: string };
};

export function HeroChat({ chat }: { chat: HeroChatContent }) {
  const { lines } = chat;
  const FINAL = lines.length + 1;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const { events, doneAt } = useMemo(() => buildChatTimeline(lines), [lines]);

  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!inView || reduce || finished) return;
    const timers = events.map((e) =>
      window.setTimeout(() => {
        setStep(e.step);
        setTyping(e.typing);
      }, e.at * 1000),
    );
    timers.push(window.setTimeout(() => setFinished(true), doneAt * 1000));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduce, finished, run, events, doneAt]);

  // Movimento reduzido ou conversa pulada: estado final direto, sem "digitando".
  const final = reduce || finished;
  const shownStep = final ? FINAL : step;
  const typingAt = final ? null : typing;

  function replay() {
    setStep(0);
    setTyping(null);
    setFinished(false);
    setRun((r) => r + 1);
  }

  return (
    <div ref={ref} className="relative flex flex-col items-center gap-4 lg:items-end lg:gap-8">
      <div className="relative w-full lg:w-auto">
        <PhoneFrame shop={chat.shop} shopStatus={chat.shopStatus}>
          <div role="group" aria-label={chat.label} className="flex flex-1 flex-col gap-2 overflow-hidden p-3">
            {lines.map((line, i) => (
              <Bubble key={i} from={line.from} shown={shownStep > i} typing={typingAt === i}>
                {line.text}
              </Bubble>
            ))}
          </div>
        </PhoneFrame>

        <m.div
          data-motion-final
          variants={enter}
          initial="hidden"
          animate={shownStep >= FINAL ? "shown" : "hidden"}
          className="mx-auto mt-4 w-full rounded-lg border border-border bg-surface-1 px-4 pt-3 pb-1 lg:absolute lg:-bottom-6 lg:-left-9 lg:mt-0 lg:w-max lg:shadow-overlay"
        >
          <p className="text-caption text-text-muted">{chat.agenda.title}</p>
          <AppointmentRow
            time={chat.agenda.time}
            service={chat.agenda.service}
            client={chat.agenda.client}
            professional={chat.agenda.professional}
            status="scheduled"
          />
        </m.div>
      </div>

      <div data-motion-only>
        {finished ? (
          <Button variant="ghost" icon={<Icon icon={RotateCcw} />} onClick={replay}>
            {chat.replay}
          </Button>
        ) : (
          <Button variant="ghost" icon={<Icon icon={SkipForward} />} onClick={() => setFinished(true)}>
            {chat.skip}
          </Button>
        )}
      </div>
    </div>
  );
}

function PhoneFrame({ shop, shopStatus, children }: { shop: string; shopStatus: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto h-device-h w-device-w rounded-device bg-device-frame p-device-bezel">
      <div className="flex h-full flex-col overflow-hidden rounded-device-screen bg-chat-bg">
        <div className="flex items-center gap-3 border-b border-border bg-surface-1 px-4 pt-6 pb-3">
          <span className="inline-flex size-7 items-center justify-center rounded-pill bg-accent-soft text-accent-strong">
            <Icon icon={Store} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-small font-bold text-text">{shop}</p>
            <p className="text-caption text-text-muted">{shopStatus}</p>
          </div>
        </div>
        {children}
        <div aria-hidden="true" className="px-3 pt-2 pb-4">
          <div className="rounded-pill border border-border bg-surface-1 px-4 py-2 text-small text-text-muted">
            Mensagem
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  from,
  shown,
  typing,
  children,
}: {
  from: "client" | "assistant";
  shown: boolean;
  typing: boolean;
  children: string;
}) {
  const client = from === "client";
  return (
    <div className={`relative flex ${client ? "justify-end" : "justify-start"}`}>
      <m.p
        data-motion-final
        variants={enter}
        initial="hidden"
        animate={shown ? "shown" : "hidden"}
        className={`max-w-[82%] rounded-bubble border border-border px-3 py-2 text-small text-text ${
          client ? "rounded-br-bubble-tail bg-chat-bubble-client" : "rounded-bl-bubble-tail bg-chat-bubble-assistant"
        }`}
      >
        <span className="sr-only">{client ? "Cliente: " : "Assistente: "}</span>
        {children}
      </m.p>
      {typing && <TypingDots />}
    </div>
  );
}

function TypingDots() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-0 left-0 flex items-center gap-1 rounded-bubble rounded-bl-bubble-tail border border-border bg-chat-bubble-assistant px-3 py-3"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-2 rounded-pill bg-text-muted animate-[kort-typing_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
