"use client";
import { useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const flip = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button className="icon-btn" onClick={flip} aria-label={theme === "dark" ? "Usar modo claro" : "Usar modo escuro"}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: theme === "dark" ? 360 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        key={theme}
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </motion.svg>
    </button>
  );
}
