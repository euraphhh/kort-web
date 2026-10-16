"use client";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Wordmark } from "./logo";
import ThemeToggle from "./theme-toggle";

export const FORM_URL = "https://forms.gle/pP3CXawcXEz9NLb2A";

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      className={`nav ${scrolled ? "is-scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-inner">
        <a href="#top" aria-label="kort — início" className="nav-logo">
          <Wordmark />
        </a>
        <nav className="nav-links" aria-label="Seções">
          <a href="#assistente">Assistente</a>
          <a href="#agenda">Agenda</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#recursos">Recursos</a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="btn btn-small" href={FORM_URL} target="_blank" rel="noopener noreferrer">
              Participar da pesquisa
            </a>
        </div>
      </div>
      <motion.div className="nav-progress" style={{ scaleX: progress }} />
    </motion.header>
  );
}
