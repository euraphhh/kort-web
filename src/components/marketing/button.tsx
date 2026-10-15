import type { ComponentPropsWithoutRef, ReactNode } from "react";

// Button do design system (design/components/Button). Uma `primary` por seção.

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-target-min items-center justify-center gap-2 rounded-md border-[1.5px] px-4 " +
  "text-body-strong whitespace-nowrap no-underline select-none " +
  "transition-[scale] duration-(--duration-fast) ease-out active:scale-(--scale-press) " +
  "disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-accent text-on-accent hover:bg-accent-strong",
  secondary: "border-border-control bg-surface-1 text-text hover:bg-surface-2",
  ghost: "border-transparent bg-transparent text-accent hover:bg-accent-soft hover:text-accent-strong",
};

type Common = { variant?: Variant; icon?: ReactNode; children?: ReactNode; className?: string };

export function ButtonLink({
  variant = "primary",
  icon,
  children,
  className = "",
  ...rest
}: Common & Omit<ComponentPropsWithoutRef<"a">, "className" | "children">) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  icon,
  children,
  className = "",
  type = "button",
  ...rest
}: Common & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
}
