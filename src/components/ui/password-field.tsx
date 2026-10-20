"use client";

import { useState } from "react";
import { TextField, type TextFieldProps } from "./text-field";

// TextField for passwords, with a "Mostrar/Ocultar" button inside. The button says which field it
// belongs to, so a screen with two password fields stays unambiguous for screen readers.

export function PasswordField({
  toggleName = "senha",
  ...props
}: Omit<TextFieldProps, "type" | "trailing"> & { toggleName?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          aria-label={`${visible ? "Ocultar" : "Mostrar"} ${toggleName}`}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="inline-flex min-h-target-min items-center rounded-md px-(--space-4) text-caption font-semibold text-accent hover:text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      }
    />
  );
}
