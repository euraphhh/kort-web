"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChatWindow, type Msg } from "./chat";
import { MaskLine } from "./reveal";
import { FORM_URL } from "./nav";

const SCRIPT: Omit<Msg, "id">[] = [
  { from: "me", text: "e aí, tem horário hoje pra cortar o cabelo?" },
  { from: "bot", text: "opa! eu sou o assistente virtual da Barbearia Exemplo. hoje tenho 17h30 com o Marcos e 18h com o Léo. qual prefere?" },
  { from: "me", text: "17h30 com o Marcos" },
  { from: "bot", text: "fechou! corte com o Marcos hoje às 17h30. já deixei na agenda dele ✓" },
];

const STATIC_MSGS: Msg[] = SCRIPT.map((m, i) => ({ ...m, id: i }));

function BubbleShape() {
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true" className="hero-bubble-svg">
      <path
        d="M300 40C443 40 560 157 560 300C560 443 443 560 300 560C264 560 230 553 199 540L78 580C66 584 56 574 60 562L92 462C58 421 40 363 40 300C40 157 157 40 300 40Z"
        fill="currentColor"
      />
    </svg>
  );
}

export type HeroVariant = "split" | "center";

export default function Hero({ variant = "split" }: { variant?: HeroVariant }) {
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const idRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bubbleY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const bubbleRot = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let i = 0;
    const later = (fn: () => void, ms: number) => timers.push(setTimeout(() => !cancelled && fn(), ms));
    const step = () => {
      if (i >= SCRIPT.length) {
        later(() => {
          setMsgs([]);
          i = 0;
          step();
        }, 4200);
        return;
      }
      const m = SCRIPT[i];
      const push = () => {
        setMsgs((p) => [...p, { ...m, id: idRef.current++ }]);
        i += 1;
        step();
      };
      if (m.from === "bot") {
        setTyping(true);
        later(() => {
          setTyping(false);
          push();
        }, 1500);
      } else {
        later(push, i === 0 ? 1600 : 1100);
      }
    };
    step();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <section id="top" ref={sectionRef} className={`hero hero-${variant}`}>
      <div className="hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <MaskLine delay={0.15}>Você corta.</MaskLine>
            <MaskLine delay={0.3}>O kort</MaskLine>
            <MaskLine delay={0.45}>
              <em>atende.</em>
            </MaskLine>
          </h1>
          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Agenda por profissional, WhatsApp oficial da sua barbearia e um assistente de IA que marca horário pelo
            WhatsApp, a qualquer hora.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <a className="btn" href={FORM_URL} target="_blank" rel="noopener noreferrer">
                Participar da pesquisa
                <span className="btn-arrow" aria-hidden="true">→</span>
              </a>
            <a className="btn btn-ghost" href="#assistente">
              Testar o assistente
            </a>
          </motion.div>
          <motion.p
            className="hero-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            O kort está sendo construído junto com barbeiros. Ainda não está à venda.
          </motion.p>
        </div>

        <div className="hero-stage">
          <motion.div
            className="hero-bubble"
            style={{ y: bubbleY, rotate: bubbleRot }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={reduce ? undefined : { scale: [1, 1.035, 1], rotate: [0, 1.5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <BubbleShape />
            </motion.div>
          </motion.div>

          <motion.div className="hero-phone" style={{ y: phoneY }}>
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChatWindow messages={reduce ? STATIC_MSGS : msgs} typing={reduce ? false : typing} />
              </motion.div>
            </motion.div>
          </motion.div>

          {[
            { t: "horário confirmado", c: "chip-a", d: 2.2 },
            { t: "agenda do Marcos atualizada", c: "chip-b", d: 2.5 },
            { t: "cliente avisado no WhatsApp", c: "chip-c", d: 2.8 },
          ].map((chip, i) => (
            <motion.div
              key={chip.t}
              className={`float-chip ${chip.c}`}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: chip.d }}
            >
              <motion.span
                className="chip-inner"
                animate={reduce ? undefined : { y: [0, i % 2 ? 8 : -8, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              >
                <i className="chip-dot" />
                {chip.t}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
