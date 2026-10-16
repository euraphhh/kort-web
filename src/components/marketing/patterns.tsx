import { useId } from "react";

// Patterns da identidade (artefato "Patterns e texturas"). Cores só por token.
const BUBBLE = "M78.2 91.8A28 28 0 1 1 90 98.8M78.2 91.8L76 106L90 98.8";
const FILLED = "M74 90L69 111L94 103Z";

type Tone = "ink" | "suede" | "creme";
const color = (t: Tone) => ({ ink: "var(--brand-couro)", suede: "var(--brand-camurca)", creme: "var(--brand-creme)" })[t];

function Outline({ x, y, s, flip, tone }: { x: number; y: number; s: number; flip?: boolean; tone: Tone }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) translate(-96 -72)`} fill="none" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: color(tone) }}>
      <path d={BUBBLE} />
    </g>
  );
}

function Filled({ x, y, s, tone, dots }: { x: number; y: number; s: number; tone: Tone; dots?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-96 -72)`}>
      <g strokeWidth={6} strokeLinejoin="round" style={{ fill: color(tone), stroke: color(tone) }}>
        <circle cx="98" cy="72" r="34" />
        <path d={FILLED} />
      </g>
      {dots && (
        <g style={{ fill: "var(--motif-dots)" }}>
          <circle cx="84" cy="72" r="5" />
          <circle cx="98" cy="72" r="5" />
          <circle cx="112" cy="72" r="5" />
        </g>
      )}
    </g>
  );
}

/** Faixa de balões de vários tamanhos, como uma conversa acontecendo. */
export function ConversaPattern({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const id = useId();
  const main: Tone = onDark ? "creme" : "ink";
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%" style={{ ["--motif-dots" as string]: onDark ? "var(--brand-couro)" : "var(--brand-creme)" }}>
      <defs>
        <pattern id={id} width="240" height="200" patternUnits="userSpaceOnUse">
          <Outline x={46} y={46} s={0.42} tone={main} />
          <Filled x={138} y={34} s={0.24} tone="suede" />
          <Outline x={202} y={94} s={0.44} flip tone="suede" />
          <Outline x={94} y={130} s={0.3} flip tone={main} />
          <Filled x={172} y={166} s={0.36} tone={main} dots />
          <Filled x={32} y={168} s={0.2} tone="suede" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

type Pill = Tone | "tinta";
const pillFill = (t: Pill) => (t === "tinta" ? "var(--brand-tinta)" : color(t));

// Cada linha repete sem emenda: soma das larguras + 12px de vão por pílula = 800.
const GAP = 12;
const TILE = 800;
const ROWS: { w: number; t: Pill }[][] = [
  [{ w: 150, t: "ink" }, { w: 80, t: "suede" }, { w: 140, t: "tinta" }, { w: 118, t: "suede" }, { w: 150, t: "ink" }, { w: 90, t: "tinta" }],
  [{ w: 110, t: "suede" }, { w: 200, t: "tinta" }, { w: 70, t: "ink" }, { w: 160, t: "suede" }, { w: 100, t: "ink" }, { w: 88, t: "tinta" }],
  [{ w: 70, t: "tinta" }, { w: 130, t: "ink" }, { w: 170, t: "suede" }, { w: 110, t: "tinta" }, { w: 160, t: "ink" }, { w: 88, t: "suede" }],
  [{ w: 190, t: "ink" }, { w: 90, t: "suede" }, { w: 110, t: "tinta" }, { w: 160, t: "ink" }, { w: 80, t: "suede" }, { w: 98, t: "tinta" }],
];

function AgendaRow({ pills, index }: { pills: { w: number; t: Pill }[]; index: number }) {
  const id = useId();
  const xs = pills.map((_, i) => pills.slice(0, i).reduce((sum, q) => sum + q.w + GAP, 0));
  return (
    <div className={`agenda-row ${index % 2 ? "is-rev" : ""}`} style={{ ["--i" as string]: index }}>
      <svg aria-hidden="true" width="100%" height="28">
        <defs>
          <pattern id={id} width={TILE} height="28" patternUnits="userSpaceOnUse">
            {pills.map(({ w, t }, i) => {
              return <rect key={i} x={xs[i]} y={0} width={w} height={28} rx={14} style={{ fill: pillFill(t) }} />;
            })}
          </pattern>
        </defs>
        <rect width="100%" height="28" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** Horários como pílulas: cada linha balança para um lado, alternando. */
export function AgendaPattern({ className }: { className?: string }) {
  return (
    <div className={`agenda-rows ${className ?? ""}`} aria-hidden="true">
      {ROWS.map((r, i) => (
        <AgendaRow key={i} pills={r} index={i} />
      ))}
    </div>
  );
}

/** Divisória entre seções: o pattern esmaece nas bordas de cima e de baixo. */
export function PatternBand({ kind }: { kind: "conversa" | "agenda" }) {
  return (
    <div className={`pattern-band pattern-${kind}`} aria-hidden="true">
      {kind === "conversa" ? (
        <div className="pattern-drift">
          <ConversaPattern />
        </div>
      ) : (
        <AgendaPattern />
      )}
    </div>
  );
}
