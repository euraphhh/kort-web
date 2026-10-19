// Who sees what in the panel. Pure and tested: the layout, the pages and the nav all read this,
// so the menu and the guard never disagree. RLS is still the real wall between barbershops; this
// only decides navigation (spec: docs/specs/painel-login-e-acesso.md, decided 19/oct/2026:
// the barber with a login does not see customers).

export type Role = "owner" | "barber";

export type NavItem = {
  href: string;
  /** Interface label, pt-BR. */
  label: string;
  /** Icon key, resolved in the nav component. */
  icon: "agenda" | "to-close" | "customers" | "services" | "team" | "settings" | "profile";
  roles: readonly Role[];
  /** Shown on the phone tab bar; the rest goes under "Mais". */
  primary: boolean;
};

const NAV: readonly NavItem[] = [
  { href: "/agenda", label: "Agenda", icon: "agenda", roles: ["owner", "barber"], primary: true },
  { href: "/to-close", label: "A fechar", icon: "to-close", roles: ["owner", "barber"], primary: true },
  { href: "/customers", label: "Clientes", icon: "customers", roles: ["owner"], primary: true },
  { href: "/services", label: "Serviços", icon: "services", roles: ["owner"], primary: false },
  { href: "/team", label: "Equipe", icon: "team", roles: ["owner"], primary: false },
  { href: "/settings", label: "Configurações", icon: "settings", roles: ["owner"], primary: false },
  { href: "/profile", label: "Perfil", icon: "profile", roles: ["owner", "barber"], primary: false },
];

export const PANEL_PATHS: readonly string[] = NAV.map((item) => item.href);

export function navFor(role: Role): NavItem[] {
  return NAV.filter((item) => item.roles.includes(role));
}

export function canAccess(role: Role | null, pathname: string): boolean {
  if (!role) return false;
  const item = NAV.find((entry) => pathname === entry.href || pathname.startsWith(`${entry.href}/`));
  return item ? item.roles.includes(role) : false;
}

export function homePath(): string {
  return "/agenda";
}
