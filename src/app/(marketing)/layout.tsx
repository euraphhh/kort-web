import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/marketing/providers";
import tokens from "../../../design/tokens.json";
import "@/styles/globals.css";

// Cor da barra do navegador = token `bg` de cada tema, lido do design system.
const bg = tokens.color.tokens.find((t) => t.name === "bg")?.value as { light: string; dark: string };

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: bg.light },
    { media: "(prefers-color-scheme: dark)", color: bg.dark },
  ],
};

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "kort · chamou, agendou.",
  description:
    "Assistente de IA no WhatsApp da sua barbearia: responde o cliente e marca o horário direto na sua agenda. Sem app e sem link.",
  icons: { icon: "/brand/kort-icone.svg", apple: "/brand/kort-icone.svg" },
};

// Root layout da landing. O painel terá o próprio root layout em outro route group.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable} suppressHydrationWarning>
      <body>
        <noscript>
          <style>{"[data-motion-final]{opacity:1!important;transform:none!important}[data-motion-only]{display:none!important}"}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
