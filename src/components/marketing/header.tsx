import Link from "next/link";
import { ButtonLink } from "./button";
import { cta, nav } from "./content";
import { Wordmark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg px-4 lg:px-7">
      <div className="mx-auto flex max-w-container items-center gap-4 py-2">
        <Link href="/" className="flex min-h-target-min items-center rounded-sm" aria-label="kort, início">
          <Wordmark width={72} eager />
        </Link>
        <nav aria-label="Seções" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-target-min items-center rounded-md px-3 text-body-strong text-text-muted hover:text-text"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <ButtonLink variant="secondary" href={cta.href}>
            {cta.shortLabel}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
