import { ButtonLink } from "./button";
import { chat, cta, hero } from "./content";
import { HeroChat } from "./hero-chat";

// O texto do hero é HTML do servidor, sem animação de entrada: legível sem JS (LCP).
export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="px-4 pt-8 pb-8 lg:px-7 lg:pt-9 lg:pb-9">
      <div className="mx-auto grid max-w-container items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex max-w-prose flex-col items-start gap-5">
          <h1 id="hero-titulo" className="text-display text-balance lg:text-display-lg">
            {hero.headline}
          </h1>
          <p className="text-lead text-pretty text-text-muted">{hero.lead}</p>
          <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
        </div>
        <HeroChat chat={chat} />
      </div>
    </section>
  );
}
