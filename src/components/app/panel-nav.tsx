"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { NavItem } from "@/lib/auth/access";
import { signOut } from "@/app/(app)/(panel)/actions";
import { MoreIcon, NavIcon, SignOutIcon, ThemeIcon } from "./nav-icons";

// Navigation of the panel. Desktop: a side bar. Phone: a bottom bar with the main items and a
// "Mais" menu for the rest, theme and sign out. The active item is marked with a background,
// bold text and aria-current, never color alone.

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";
const itemBase = `inline-flex min-h-target-min items-center gap-(--space-3) rounded-md px-(--space-3) text-body-strong no-underline ${focus}`;
const itemState = (active: boolean) =>
  active ? "bg-accent-soft text-accent-strong" : "text-text hover:bg-surface-2";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ThemeButton({ className }: { className: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className={className}>
      <ThemeIcon className="size-icon-ui shrink-0" />
      Trocar tema
    </button>
  );
}

function SignOutButton({ className }: { className: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={`${className} w-full`}>
        <SignOutIcon className="size-icon-ui shrink-0" />
        Sair
      </button>
    </form>
  );
}

function NavLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`${itemBase} ${itemState(active)}`}
    >
      <NavIcon name={item.icon} className="size-icon-ui shrink-0" />
      {item.label}
    </Link>
  );
}

export function SideNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="flex flex-col gap-(--space-1)">
      {items.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} />
      ))}
    </nav>
  );
}

export function SideActions() {
  const quiet = `${itemBase} cursor-pointer text-text-muted hover:bg-surface-2 hover:text-text`;
  return (
    <div className="flex flex-col gap-(--space-1)">
      <ThemeButton className={quiet} />
      <SignOutButton className={quiet} />
    </div>
  );
}

export function TabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const primary = items.filter((item) => item.primary);
  const more = items.filter((item) => !item.primary);
  const moreActive = more.some((item) => isActive(pathname, item.href));

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const tab = `flex min-h-target-min flex-1 flex-col items-center justify-center gap-(--space-1) rounded-md px-(--space-2) py-(--space-2) text-caption font-semibold no-underline ${focus}`;
  const tabState = (active: boolean) => (active ? "bg-accent-soft text-accent-strong" : "text-text-muted hover:bg-surface-2");
  const menuItem = `${itemBase} cursor-pointer text-text hover:bg-surface-2`;

  return (
    <div ref={menuRef} className="fixed inset-x-0 bottom-0 z-10 md:hidden">
      {open && (
        <div
          id="more-menu"
          className="mx-(--space-4) mb-(--space-2) flex flex-col gap-(--space-1) rounded-lg border border-border bg-surface-1 p-(--space-2) shadow-overlay"
        >
          {more.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setOpen(false)} />
          ))}
          <ThemeButton className={menuItem} />
          <SignOutButton className={menuItem} />
        </div>
      )}
      <nav
        aria-label="Principal"
        className="flex gap-(--space-1) border-t border-border bg-surface-1 px-(--space-2) pt-(--space-2) pb-[max(var(--space-2),env(safe-area-inset-bottom))]"
      >
        {primary.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`${tab} ${tabState(active)}`}
            >
              <NavIcon name={item.icon} className="size-icon-ui" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="more-menu"
          onClick={() => setOpen((value) => !value)}
          className={`${tab} cursor-pointer ${tabState(open || moreActive)}`}
        >
          <MoreIcon className="size-icon-ui" />
          Mais
        </button>
      </nav>
    </div>
  );
}
