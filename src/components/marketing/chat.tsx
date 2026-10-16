"use client";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./logo";

export type Msg = { id: number; from: "me" | "bot" | "sys"; text: string };

export function ChatWindow({
  messages,
  typing,
  footer,
  className,
}: {
  messages: Msg[];
  typing: boolean;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`chat ${className ?? ""}`}>
      <div className="chat-head">
        <Icon className="chat-avatar" />
        <div className="chat-who">
          <strong>Barbearia Exemplo</strong>
          <span className="chat-status">
            <i /> online
          </span>
        </div>
        <span className="chat-badge">conta oficial</span>
      </div>
      <div className="chat-body" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout="position"
              className={`bubble ${m.from}`}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {m.text}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout="position"
              className="bubble bot typing"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <i />
              <i />
              <i />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {footer}
    </div>
  );
}
