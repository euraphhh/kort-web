"use client";
import { motion } from "motion/react";
import { MaskLine, Reveal } from "./reveal";

type Slot = { at: number; dur: number; label: string; wa?: boolean; fresh?: boolean };
const PX = 1.1; // px por minuto
const START = 9; // 9h
const END = 19;

const PROS: { name: string; slots: Slot[] }[] = [
  {
    name: "Marcos",
    slots: [
      { at: 0, dur: 30, label: "Corte · João" },
      { at: 90, dur: 60, label: "Corte + barba · Pedro", wa: true },
      { at: 270, dur: 30, label: "Barba · Caio" },
      { at: 360, dur: 30, label: "Corte · Rui", wa: true },
      { at: 510, dur: 30, label: "Corte · novo", wa: true, fresh: true },
    ],
  },
  {
    name: "Léo",
    slots: [
      { at: 30, dur: 45, label: "Corte + sobrancelha · Davi", wa: true },
      { at: 150, dur: 30, label: "Barba · Enzo" },
      { at: 300, dur: 60, label: "Corte + barba · Théo", wa: true },
      { at: 540, dur: 30, label: "Corte · Nando" },
    ],
  },
  {
    name: "Dudu",
    slots: [
      { at: 0, dur: 30, label: "Corte · Beto" },
      { at: 60, dur: 30, label: "Pezinho · Igor", wa: true },
      { at: 240, dur: 45, label: "Corte · Vini" },
      { at: 420, dur: 30, label: "Barba · Gui", wa: true },
      { at: 480, dur: 60, label: "Corte + barba · Lucas", wa: true },
    ],
  },
];

export default function Agenda() {
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  const height = (END - START) * 60 * PX;
  return (
    <section id="agenda" className="section agenda">
      <div className="agenda-head">
        <h2 className="h2">
          <MaskLine inView>Uma agenda</MaskLine>
          <MaskLine inView delay={0.12}>
            por <em>profissional.</em>
          </MaskLine>
        </h2>
        <Reveal delay={0.1}>
          <p className="lead">
            Cada barbeiro com a sua coluna e serviços de durações diferentes. O que o assistente marca no WhatsApp cai
            direto no lugar certo.
          </p>
        </Reveal>
      </div>

      <Reveal y={40}>
        <div className="agenda-board" role="img" aria-label="Exemplo de agenda com três profissionais e horários marcados">
          <div className="agenda-scroll">
            <div className="agenda-grid" style={{ ["--h" as string]: `${height}px` }}>
              <div className="agenda-axis" aria-hidden="true">
                <div className="agenda-corner" />
                <div className="agenda-hours">
                  {hours.map((h) => (
                    <span key={h} style={{ top: (h - START) * 60 * PX }}>
                      {h}h
                    </span>
                  ))}
                </div>
              </div>
              {PROS.map((p, ci) => (
                <div className="agenda-col" key={p.name}>
                  <div className="agenda-colhead">
                    <span className="avatar">{p.name[0]}</span>
                    {p.name}
                  </div>
                  <div className="agenda-lane">
                    {hours.map((h) => (
                      <i key={h} className="agenda-tick" style={{ top: (h - START) * 60 * PX }} />
                    ))}
                    {p.slots.map((s, si) => (
                      <motion.div
                        key={s.label}
                        className={`slot ${s.wa ? "slot-wa" : ""} ${s.fresh ? "slot-fresh" : ""}`}
                        style={{ top: s.at * PX + 2, height: s.dur * PX - 4, transformOrigin: "top" }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        whileInView={{ scaleY: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.6,
                          delay: s.fresh ? 1.9 : ci * 0.12 + si * 0.09,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -2, scale: 1.02 }}
                      >
                        <span>{s.label}</span>
                        {s.fresh && <b className="slot-tag">novo no WhatsApp</b>}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="agenda-legend">
            <span>
              <i className="lg lg-wa" /> marcado pelo assistente
            </span>
            <span>
              <i className="lg lg-manual" /> marcado na barbearia
            </span>
            <span className="fine">Agenda de exemplo.</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
