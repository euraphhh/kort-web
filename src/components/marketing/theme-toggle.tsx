"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Icon } from "./icon";

// O ícone troca pelo CSS (variante dark), então não há flash nem estado de "montado".
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Alternar entre tema claro e escuro"
      className="inline-flex size-target-min items-center justify-center rounded-md text-text hover:bg-surface-2"
    >
      <span className="dark:hidden">
        <Icon icon={Moon} />
      </span>
      <span className="hidden dark:inline">
        <Icon icon={Sun} />
      </span>
    </button>
  );
}
