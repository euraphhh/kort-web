import {
  Bell,
  CalendarCheck,
  Check,
  ChevronDown,
  Hand,
  MessageCircleQuestion,
  Repeat,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { AppointmentRow, Counter, type AppointmentStatus } from "./agenda";
import { ButtonLink } from "./button";
import { assistant, cta, faq, finalCta, footer, howItWorks, pain, panel } from "./content";
import { Icon } from "./icon";
import { Wordmark } from "./logo";
import { Reveal } from "./reveal";
import { Section, SectionTitle } from "./section";

export function Pain() {
  return (
    <Section labelledBy="dor-titulo">
      <SectionTitle id="dor-titulo">{pain.title}</SectionTitle>
      <Reveal>
        <ul className="mt-7 grid gap-x-7 md:grid-cols-3">
          {pain.items.map((item) => (
            <li key={item.title} className="border-t border-border py-5">
              <h3 className="text-heading">{item.title}</h3>
              <p className="mt-2 text-text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section id="como-funciona" labelledBy="como-titulo" className="border-y border-border bg-surface-1">
      <SectionTitle id="como-titulo">{howItWorks.title}</SectionTitle>
      <Reveal>
        <ol className="mt-7 grid gap-6 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="tabular inline-flex size-7 items-center justify-center rounded-pill bg-accent-soft text-body-strong font-bold text-accent-strong"
              >
                {i + 1}
              </span>
              <h3 className="text-heading">{step.title}</h3>
              <p className="text-text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

const featureIcons: Record<(typeof assistant.features)[number]["icon"], LucideIcon> = {
  calendar: CalendarCheck,
  repeat: Repeat,
  question: MessageCircleQuestion,
  bell: Bell,
  hand: Hand,
  user: UserRound,
};

export function Assistant() {
  return (
    <Section id="assistente" labelledBy="assistente-titulo">
      <SectionTitle id="assistente-titulo">{assistant.title}</SectionTitle>
      <p className="mt-4 max-w-prose text-lead text-text-muted">{assistant.lead}</p>
      <Reveal>
        <ul className="mt-7 grid gap-x-7 md:grid-cols-2">
          {assistant.features.map((f) => (
            <li key={f.title} className="flex gap-4 border-t border-border py-5">
              <span className="inline-flex size-target-min flex-none items-center justify-center rounded-md bg-accent-soft text-accent-strong">
                <Icon icon={featureIcons[f.icon]} />
              </span>
              <div>
                <h3 className="text-heading">{f.title}</h3>
                <p className="mt-1 text-text-muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

export function Panel() {
  const { mock } = panel;
  return (
    <Section id="painel" labelledBy="painel-titulo" className="border-y border-border bg-surface-1">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle id="painel-titulo">{panel.title}</SectionTitle>
          <p className="mt-4 max-w-prose text-lead text-text-muted">{panel.lead}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {panel.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-1 text-accent-strong">
                  <Icon icon={Check} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <Reveal>
          <figure aria-label={mock.label} className="rounded-lg border border-border bg-bg p-5">
            <p className="text-title">{mock.title}</p>
            <p className="text-small text-text-muted">{mock.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mock.counters.map((c) => (
                <Counter key={c.label} count={c.count} label={c.label} />
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-border bg-surface-1 px-4">
              {mock.rows.map((r) => (
                <AppointmentRow
                  key={r.time}
                  time={r.time}
                  service={r.service}
                  client={r.client}
                  professional={"professional" in r ? r.professional : undefined}
                  status={r.status as AppointmentStatus}
                />
              ))}
            </div>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

export function Faq() {
  return (
    <Section id="perguntas" labelledBy="perguntas-titulo">
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <SectionTitle id="perguntas-titulo">{faq.title}</SectionTitle>
        <div className="border-t border-border">
          {faq.items.map((item) => (
            <details key={item.q} className="group border-b border-border">
              <summary className="flex min-h-target-min cursor-pointer list-none items-center justify-between gap-4 py-4 text-body-strong [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-text-muted transition-transform duration-(--duration-base) ease-out group-open:rotate-180">
                  <Icon icon={ChevronDown} />
                </span>
              </summary>
              <p className="max-w-prose pb-5 text-text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <Section labelledBy="cta-titulo" className="border-t border-border bg-surface-1">
      <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-prose">
          <h2 id="cta-titulo" className="text-title text-balance lg:text-display">
            {finalCta.title}
          </h2>
          <p className="mt-3 text-lead text-text-muted">{finalCta.lead}</p>
        </div>
        <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-7 lg:px-7">
      <div className="mx-auto flex max-w-container flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Wordmark width={64} />
          <p className="text-small text-text-muted">{footer.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small text-text-muted">
          {footer.links.map((l) => (
            <a key={l.href} href={l.href} className="inline-flex min-h-target-min items-center underline-offset-4 hover:text-text hover:underline">
              {l.label}
            </a>
          ))}
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
