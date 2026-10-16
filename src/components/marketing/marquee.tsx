const ITEMS = [
  "agenda por profissional",
  "whatsapp oficial",
  "assistente de IA",
  "sem caderninho",
  "sem planilha",
  "atendente quando precisar",
];

export default function Marquee() {
  const row = (key: string) => (
    <ul className="marquee-row" aria-hidden={key === "b"} key={key}>
      {ITEMS.map((t) => (
        <li key={t}>
          <span>{t}</span>
          <svg viewBox="0 0 30 30" className="marquee-dot" aria-hidden="true">
            <path d="M15 3C22 3 27 8 27 15S22 27 15 27c-2 0-3.700-.4-5.200-1L4 28l1.800-5.400C4.400 20.800 3 18 3 15 3 8 8 3 15 3Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-wrap" role="presentation">
      <div className="marquee">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
      </div>
    </div>
  );
}
