import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// Button from the design system (design/components/Button). One `primary` per screen; at least
// 44px tall (target-min); `block` fills the width in mobile forms.

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Shared = {
  variant?: Variant;
  block?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

const base =
  "inline-flex min-h-target-min items-center justify-center gap-(--space-2) rounded-md border-[1.5px] border-transparent px-(--space-4) text-body-strong whitespace-nowrap no-underline cursor-pointer " +
  "transition-[transform,background-color,color] duration-(--duration-fast) ease-out active:scale-(--scale-press) " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-strong",
  secondary: "border-border-control bg-surface-1 text-text hover:bg-surface-2",
  ghost: "bg-transparent text-accent hover:bg-accent-soft hover:text-accent-strong",
  danger: "border-danger bg-transparent text-danger hover:bg-surface-2",
};

function classes({ variant = "primary", block, className }: Shared) {
  return [base, variants[variant], block && "w-full", className].filter(Boolean).join(" ");
}

export type ButtonProps = Shared & Omit<ComponentProps<"button">, keyof Shared>;

/** A real <button>; defaults to type="button", so pass type="submit" in forms. */
export function Button({ variant, block, icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={classes({ variant, block, className, children })} {...rest}>
      {icon}
      {children}
    </button>
  );
}

export type ButtonLinkProps = Shared & Omit<ComponentProps<typeof Link>, keyof Shared>;

/** A link that looks like a button (navigation, not an action). */
export function ButtonLink({ variant, block, icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={classes({ variant, block, className, children })} {...rest}>
      {icon}
      {children}
    </Link>
  );
}
