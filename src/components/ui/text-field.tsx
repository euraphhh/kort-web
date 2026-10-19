import type { ComponentProps } from "react";
import { AlertIcon } from "./icons";

// TextField from the design system (design/components/TextField): the label is always visible
// above the field (the placeholder is only an example), the outline uses border-control, and an
// error is one sentence that says what to do and replaces the hint. The error has an icon and
// words, never just a color.

export type TextFieldProps = Omit<ComponentProps<"input">, "id" | "name"> & {
  /** Also used as the id, so the label, the hint and the error stay linked. */
  name: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ name, label, hint, error, className, ...input }: TextFieldProps) {
  const messageId = `${name}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-(--space-2)">
      <label htmlFor={name} className="text-caption font-semibold text-text">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={[
          "min-h-target-min w-full rounded-md border-[1.5px] bg-surface-1 px-(--space-4) text-body text-text placeholder:text-text-muted",
          error ? "border-danger" : "border-border-control",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...input}
      />
      {message && (
        <p
          id={messageId}
          className={`flex items-start gap-(--space-2) text-caption font-medium ${error ? "text-danger" : "text-text-muted"}`}
        >
          {error && <AlertIcon className="size-icon-ui shrink-0" />}
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
