import type { NavItem } from "@/lib/auth/access";

// Rounded-stroke icons in currentColor (16px by default, `icon-ui`). Decorative: the label next to
// each one carries the meaning.

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ICONS: Record<NavItem["icon"], (props: IconProps) => React.ReactElement> = {
  agenda: (p) => (
    <Svg {...p}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </Svg>
  ),
  "to-close": (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  ),
  customers: (p) => (
    <Svg {...p}>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20c.5-3.6 3.1-5.5 6.5-5.5s6 1.9 6.5 5.5" />
      <path d="M16 5.2a3.3 3.3 0 0 1 0 6.2M18 14.8c1.8.7 3 2.3 3.5 5.2" />
    </Svg>
  ),
  services: (p) => (
    <Svg {...p}>
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <path d="M8.5 8 20 18M8.5 16 20 6" />
    </Svg>
  ),
  team: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.6-3.7 3.3-5.5 7-5.5s6.4 1.8 7 5.5" />
    </Svg>
  ),
  settings: (p) => (
    <Svg {...p}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </Svg>
  ),
  profile: (p) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5c1.2-2.2 3-3 5.5-3s4.3.8 5.5 3" />
    </Svg>
  ),
};

export function NavIcon({ name, className }: { name: NavItem["icon"]; className?: string }) {
  return ICONS[name]({ className });
}

export function MoreIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="5.5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="18.5" cy="12" r="1.2" />
    </Svg>
  );
}

export function ThemeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </Svg>
  );
}

export function SignOutIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </Svg>
  );
}
