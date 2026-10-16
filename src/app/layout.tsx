import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

// Exceção da landing: serifa itálica só nas palavras de destaque (ver AGENTS.md).
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "kort — chamou, agendou.",
  description:
    "Agenda por profissional, WhatsApp oficial da sua barbearia e um assistente de IA que marca horário pelo WhatsApp, a qualquer hora.",
  icons: { icon: "/brand/kort-icone.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4EF" },
    { media: "(prefers-color-scheme: dark)", color: "#141110" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${manrope.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
