"use client";
import { ThemeProvider } from "next-themes";

// Same theme key as the landing, so the choice carries over between the two.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="kort-theme">
      {children}
    </ThemeProvider>
  );
}
