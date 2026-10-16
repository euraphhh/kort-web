"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatWindow, type Msg } from "./chat";
import { MaskLine, Reveal } from "./reveal";

const BASE_CHIPS = ["tem horário hoje?", "quanto é a barba?", "quero cancelar meu horário", "asdkj qwe"];
const PICK_CHIPS = ["17h30 com o Marcos", "18h com o Léo"];

export default function ChatDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [chips, setChips] = useState<string[]>(BASE_CHIPS);
  const idRef = useRef(0);
  const confused = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const add = (from: Msg["from"], text: string) => setMsgs((p) => [...p, { id: idRef.current++, from, text }]);
  const wait = (ms: number) => new Promise<void>((res) => timers.current.push(setTimeout(res, ms)));

  const botSays = async (lines: string[]) => {
    for (const l of lines) {
      setTyping(true);
      await wait(900 + Math.min(l.length * 12, 900));
      setTyping(false);
      add("bot", l);
      await wait(250);
    }
  };

  const ask = async (q: string) => {
    if (busy) return;
    setBusy(true);
    add("me", q);
    await wait(350);
    if (q === "tem horário hoje?") {
      await botSays([
        "opa! eu sou o assistente virtual da Barbearia Exemplo. como posso te ajudar hoje?",
        "tenho 17h30 com o Marcos e 18h com o Léo. qual prefere?",
      ]);
      setChips(PICK_CHIPS);
    } else if (q === "17h30 com o Marcos" || q === "18h com o Léo") {
      const quem = q.includes("Marcos") ? "o Marcos às 17h30" : "o Léo às 18h";
      await botSays([`fechou! corte com ${quem}. já deixei na agenda dele ✓`, "te aviso um dia antes, beleza?"]);
      setChips(BASE_CHIPS.filter((c) => c !== "tem horário hoje?"));
    } else if (q === "quanto é a barba?") {
      await botSays(["a barba aqui sai por R$ 35 e leva uns 30 minutos.", "quer que eu veja um horário pra você?"]);
    } else if (q === "quero cancelar meu horário") {
      await botSays(["tranquilo! me fala qual é o horário que eu libero a vaga pra outra pessoa."]);
    } else {
      confused.current += 1;
      if (confused.current === 1) {
        await botSays(["opa, não peguei essa. consegue me explicar de outro jeito?"]);
      } else {
        await botSays(["ainda não entendi. quer que eu chame um atendente?"]);
        await wait(500);
        add("sys", "o Marcos foi avisado e continua a conversa daqui");
        confused.current = 0;
      }
    }
    setBusy(false);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    confused.current = 0;
    setMsgs([]);
    setTyping(false);
    setBusy(false);
    setChips(BASE_CHIPS);
  };

  return (
    <section id="assistente" className="section demo">
      <div className="demo-grid">
        <div className="demo-copy">
          <h2 className="h2">
            <MaskLine inView>Teste o assistente.</MaskLine>
            <MaskLine inView delay={0.12}>
              Ele fala <em>como a gente.</em>
            </MaskLine>
          </h2>
          <Reveal delay={0.1}>
            <p className="lead">
              Mensagens em minúsculas, gírias, nomes escritos certinho. Se ele não entende, pede pra repetir. Se não
              entende de novo, chama alguém da barbearia.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="fine">Conversa de exemplo: nomes e valores são ilustrativos.</p>
          </Reveal>
        </div>

        <Reveal className="demo-chat" y={50}>
          <ChatWindow
            messages={msgs}
            typing={typing}
            className="chat-large"
            footer={
              <div className="chat-foot">
                <p className="chat-hint">{msgs.length === 0 ? "toca numa mensagem pra começar" : "continua a conversa"}</p>
                <div className="chips">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {chips.map((c) => (
                      <motion.button
                        key={c}
                        layout
                        className="chip"
                        disabled={busy}
                        onClick={() => ask(c)}
                        initial={{ opacity: 0, scale: 0.8, y: 8 }}
                        animate={{ opacity: busy ? 0.45 : 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileTap={{ scale: 0.94 }}
                        transition={{ type: "spring", stiffness: 400, damping: 26 }}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                {msgs.length > 0 && (
                  <button className="reset" onClick={reset}>
                    recomeçar
                  </button>
                )}
              </div>
            }
          />
        </Reveal>
      </div>
    </section>
  );
}
