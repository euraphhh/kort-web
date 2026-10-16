"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MaskLine, Reveal } from "./reveal";

const STAGES = [
  {
    t: "O cliente chama",
    d: "Ele manda mensagem no WhatsApp da sua barbearia, do jeito que já faz hoje. Sem baixar app, sem cadastro.",
  },
  {
    t: "O assistente entende",
    d: "A IA lê o pedido, descobre o serviço e quanto tempo ele leva, e cruza com a agenda de cada profissional.",
  },
  {
    t: "O horário é marcado",
    d: "Ele oferece as opções, o cliente escolhe e o horário entra direto na agenda de quem vai atender.",
  },
  {
    t: "Você só corta",
    d: "Se o assistente não entender, chama alguém da barbearia. Pra todo o resto, você nem precisa olhar o celular.",
  },
];

const TICK = 5200;

function Visual({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="vis vis-chat">
        <motion.div className="bubble me" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          tem horário hoje pra barba e cabelo?
        </motion.div>
        <motion.div className="bubble bot typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <i />
          <i />
          <i />
        </motion.div>
      </div>
    );
  if (i === 1)
    return (
      <div className="vis vis-parse">
        <p className="vis-title">o que o assistente entendeu</p>
        {[
          ["Serviço", "Corte + barba"],
          ["Duração", "1 hora"],
          ["Quando", "Hoje"],
          ["Quem pode", "Marcos · Léo"],
        ].map(([k, v], n) => (
          <motion.div
            key={k}
            className="parse-row"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + n * 0.22, type: "spring", stiffness: 260, damping: 22 }}
          >
            <span>{k}</span>
            <strong>{v}</strong>
          </motion.div>
        ))}
      </div>
    );
  if (i === 2)
    return (
      <div className="vis vis-slot">
        <p className="vis-title">agenda do Marcos · hoje</p>
        <div className="mini-lane">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="mini-row">
              <span>{16 + Math.floor(n / 2)}h{n % 2 ? "30" : ""}</span>
              {n === 3 && (
                <motion.div
                  className="mini-slot"
                  initial={{ y: -90, opacity: 0, scale: 1.1 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 16 }}
                >
                  Corte + barba · novo
                </motion.div>
              )}
              {n === 0 && <div className="mini-slot mini-busy">Corte · Rui</div>}
            </div>
          ))}
        </div>
      </div>
    );
  return (
    <div className="vis vis-done">
      <svg viewBox="0 0 120 120" className="done-ring" aria-hidden="true">
        <motion.circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        <motion.path d="M38 62L53 77L84 44" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7 }} />
      </svg>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
        Agenda atualizada. Cliente avisado.
      </motion.p>
    </div>
  );
}

export default function Stages() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % STAGES.length), TICK);
    return () => clearTimeout(t);
  }, [active, reduce]);

  return (
    <section id="como-funciona" className="section stages">
      <h2 className="h2">
        <MaskLine inView>Do “oi” ao horário</MaskLine>
        <MaskLine inView delay={0.12}>
          <em>marcado.</em>
        </MaskLine>
      </h2>
      <div className="stages-grid">
        <Reveal className="stages-tabs">
          <ol>
            {STAGES.map((s, i) => (
              <li key={s.t}>
                <button className={`stage-tab ${i === active ? "on" : ""}`} onClick={() => setActive(i)} aria-current={i === active}>
                  <span className="stage-name">{s.t}</span>
                  <AnimatePresence initial={false}>
                    {i === active && (
                      <motion.span
                        className="stage-desc"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <span>{s.d}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="stage-bar">
                    <span key={`${active}-${i}`} className={i === active && !reduce ? "run" : i < active ? "full" : ""} style={{ animationDuration: `${TICK}ms` }} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="stages-visual" delay={0.1}>
          <div className="stage-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Visual i={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
