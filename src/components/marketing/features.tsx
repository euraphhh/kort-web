"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { MaskLine } from "./reveal";

function Card({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.article
      className={`card ${className ?? ""}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </motion.article>
  );
}

export default function Features() {
  const [human, setHuman] = useState(false);
  return (
    <section id="recursos" className="section features">
      <h2 className="h2">
        <MaskLine inView>Feito pra rotina</MaskLine>
        <MaskLine inView delay={0.12}>
          <em>da barbearia.</em>
        </MaskLine>
      </h2>

      <div className="bento">
        <Card className="b-agenda">
          <h3>Cada profissional, a sua agenda</h3>
          <p>Serviços com tempos diferentes: o corte de 30 minutos e o corte com barba de 1 hora convivem sem bagunça.</p>
          <div className="bars" aria-hidden="true">
            {[62, 38, 84, 50, 72, 30, 90].map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        </Card>

        <Card className="b-wa" delay={0.08}>
          <h3>O número é da sua barbearia</h3>
          <p>WhatsApp oficial da Meta, com o número que o cliente já conhece.</p>
          <motion.div className="ring" aria-hidden="true" animate={{ scale: [1, 1.12, 1], opacity: [0.9, 0.4, 0.9] }} transition={{ duration: 3.2, repeat: Infinity }} />
        </Card>

        <Card className="b-faq" delay={0.04}>
          <h3>Responde as dúvidas de sempre</h3>
          <p>Horário de funcionamento e endereço, direto do cadastro da sua barbearia. Sem você parar o corte.</p>
          <div className="tone-bubbles" aria-hidden="true">
            <span className="bubble me">que horas vocês abrem?</span>
            <span className="bubble bot">abrimos às 9h, de segunda a sábado</span>
          </div>
        </Card>

        <Card className="b-human" delay={0.12}>
          <h3>Se travar, chama um humano</h3>
          <p>O assistente não inventa resposta: passa a conversa pra alguém da barbearia.</p>
          <button className={`switch ${human ? "on" : ""}`} onClick={() => setHuman((v) => !v)} aria-pressed={human}>
            <motion.span className="switch-thumb" layout transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            <span className="switch-l">IA</span>
            <span className="switch-r">atendente</span>
          </button>
        </Card>
      </div>
    </section>
  );
}
