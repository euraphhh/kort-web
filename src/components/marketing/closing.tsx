"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ConversaPattern } from "./patterns";
import { Wordmark } from "./logo";
import { MaskLine, Reveal } from "./reveal";
import { FORM_URL } from "./nav";

export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const rot = useTransform(scrollYProgress, [0, 1], [-12, 10]);
  return (
    <section id="pesquisa" ref={ref} className="cta">
      <Image src="/photos/cadeira-contraluz.png" alt="" fill sizes="100vw" className="cta-photo" />
      <div className="cta-pattern">
        <div className="pattern-drift">
          <ConversaPattern onDark />
        </div>
      </div>
      <motion.svg style={{ y, rotate: rot }} viewBox="0 0 600 600" aria-hidden="true" className="cta-bubble">
        <path
          d="M300 40C443 40 560 157 560 300C560 443 443 560 300 560C264 560 230 553 199 540L78 580C66 584 56 574 60 562L92 462C58 421 40 363 40 300C40 157 157 40 300 40Z"
          fill="currentColor"
        />
      </motion.svg>
      <div className="cta-inner">
        <h2 className="h2 cta-title">
          <MaskLine inView>Constrói o kort</MaskLine>
          <MaskLine inView delay={0.12}>
            <em>com a gente.</em>
          </MaskLine>
        </h2>
        <Reveal delay={0.1}>
          <p className="lead">
            Estamos montando o kort junto com barbeiros. Responde a pesquisa e conta o que mais pesa no seu dia a dia:
            é o que decide o que a gente faz primeiro.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <a className="btn btn-big" href={FORM_URL} target="_blank" rel="noopener noreferrer">
              Responder a pesquisa
              <span className="btn-arrow" aria-hidden="true">→</span>
            </a>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mark">
        <Wordmark draw />
      </div>
      <div className="footer-row">
        <nav aria-label="Rodapé">
          <a href="#assistente">Assistente</a>
          <a href="#agenda">Agenda</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
          <a href={FORM_URL} target="_blank" rel="noopener noreferrer">Pesquisa</a>
        </nav>
        <p>© 2026 kort. Gestão de barbearia com IA.</p>
        <a className="to-top" href="#top">Voltar ao topo ↑</a>
      </div>
    </footer>
  );
}
