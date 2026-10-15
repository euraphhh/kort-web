# AGENTS.md — kort

Escopo atual: **somente a landing page** (marketing). Painel, agente de WhatsApp e backend entram depois: não crie nem mexa neles.

## O produto

- kort: sistema de agendamento para barbearias com assistente de IA no WhatsApp. Tagline do design system: "chamou, agendou."
- Quem decide a compra: o dono da barbearia (e os barbeiros), no celular. O cliente final fala com o assistente no WhatsApp da própria barbearia e quase não vê a kort.
- Só prometa funcionalidade que esteja na spec do MVP (Notion › Specs). Sem acesso à spec, pergunte; não suponha.

## Stack e estrutura

- Next.js (App Router) + React + TypeScript + Tailwind v4. A landing vive no mesmo repo do app.
- Landing em `src/app/(marketing)/` (rota `/`, layout próprio). Componentes em `src/components/marketing/`. O painel ficará em outro route group: não compartilhe layout com ele.
- Se o repo já tiver outra estrutura, siga a existente e avise.
- Server Components por padrão. `'use client'` só nas folhas que animam ou têm estado.
- `next/font/google` para Manrope (400, 500, 600, 700, `display: swap`), `next/image` para imagens, `<html lang="pt-BR">`.

## Fonte da verdade visual

1. Este arquivo e `design/` (cópia do design system "kort"): leia `design/README.md` e `design/tokens.json` antes de qualquer UI.
2. As skills vêm depois. Se uma skill contradiz o design system, o design system vence.

- Só tokens: cor, tipografia, espaço, raio e sombra saem de `design/tokens.json`. Nunca hex, px ou fonte soltos no código.
- `src/styles/tokens.css` é gerado a partir do JSON (script em `scripts/`, resolvendo os aliases `{token}`). Não edite à mão.
- Tailwind v4: ligue os tokens em `@theme inline`, com os nomes do kort. Tema por `data-theme="light|dark"` no `<html>` (next-themes, `attribute="data-theme"`, `defaultTheme="system"`). Os dois temas precisam funcionar.
- Se um dia entrar shadcn, o `accent` dele (cor de hover) colide com o `accent` do kort: resolva no mapeamento, nunca renomeando o token.
- Existiu um design system anterior (azul, fonte Geom). Está obsoleto. Ignore.

## Marca

- O nome é sempre **kort**, minúsculo, inclusive no começo de frase.
- Logo só pelos SVGs oficiais em `public/brand/` (wordmark, wordmark-creme, ícone, ícone-escuro). Não redesenhe, não recolora, sem sombra, gradiente ou contorno. Wordmark com no mínimo 64px de largura; abaixo disso, o ícone (mínimo 24px). Respiro em volta = altura do "o".
- `accent` só para ação principal, link, item ativo e foco. Uma ação primária por seção. Acento nunca indica estado.
- Separe por borda, não por sombra. `shadow-overlay` só em camadas sobrepostas. Use os raios do design system; nada quadrado.
- Sem emoji na interface. Ícones de traço arredondado em `currentColor` (sugestão: Lucide; avise antes de adicionar o pacote).
- Alvo de toque de pelo menos 44px, texto de pelo menos 12px, anel de foco de 2px em `focus-ring` com 2px de afastamento.
- Estado nunca só por cor: sempre palavra e ícone.

## Voz e conteúdo

- **A voz da landing ainda não está decidida.** Provisório: fala com o dono em "você", frases curtas e diretas, caixa normal de frase, sem gíria. Horários no formato `09h30`.
- Nunca: "Prezado cliente", "Agradecemos a preferência", "Seu agendamento foi realizado com sucesso!".
- O mock de conversa do WhatsApp usa a voz do assistente (veja `design/README.md`): minúsculas, nomes próprios com maiúscula, gíria leve, no máximo um emoji.
- Nada inventado: preço, números, depoimentos, logos de clientes, "X barbearias usam". Use placeholders como `[PREÇO]` e `[NÚMERO]`. Não cite concorrentes pelo nome.
- Textos finais são aprovados pelo time. Você propõe.

## Movimento

- Biblioteca: Motion (`motion`; import de `motion/react`, e de `motion/react-client` em Server Components). Prefira `LazyMotion` + `m` + `domAnimation` para reduzir o bundle. Sem GSAP, Lenis, three.js ou outra lib sem pedir.
- Anime só `transform` e `opacity`, com propriedades explícitas. Nunca `transition: all`.
- Respeite `prefers-reduced-motion` em tudo (`MotionConfig reducedMotion="user"`): sem deslocamento, mostrando o estado final.
- Reveal ao rolar (provisório, até existirem tokens de movimento no design system): `whileInView`, `viewport={{ once: true }}`, fade + 16px de deslocamento, ~400ms, ease-out. Hover e press de botão: 150–200ms.
- Hero: o movimento principal é a conversa de WhatsApp se montando (cliente pede, assistente responde, horário confirma). Roda uma vez, com botão para repetir. Sem loop infinito. O resto da página é discreto.
- O conteúdo acima da dobra nunca começa invisível (LCP): o texto do hero tem que estar legível sem JS e com movimento reduzido.
- O design system ainda não tem tokens de movimento: proponha durações e easing, espere aprovação e só então espalhe pelo código (`src/lib/motion.ts`).

## Skills

- `frontend-design`: execução (composição, hierarquia, detalhe). A direção estética já está decidida pelo design system: a skill não escolhe estilo.
- `motion`: padrões de animação com Motion.
- `vercel-react-best-practices`: ao escrever ou refatorar componentes e carregamento de dados.
- `web-design-guidelines`: na revisão final de UI.
- Não instale nem crie outras skills ou plugins.

## Como trabalhar

- Tarefa grande: proponha o plano (seções, componentes, o que falta no design system) e espere aprovação antes de codar.
- Se o design system não cobre algo (token, componente, estado), proponha a adição e avise. Não improvise em silêncio e não crie valor solto.
- Mudanças e commits pequenos. Fique dentro de `(marketing)`, `components/marketing`, `styles`, `public/brand`, `design` e `scripts`; fora disso, avise.
- Dependência nova: avise e justifique antes de instalar. Não leia nem altere `.env` ou segredos.

## Definição de pronto

1. Build, lint e typecheck passando (use os scripts do `package.json`).
2. Revisão com `web-design-guidelines` e `vercel-react-best-practices`: corrija o que apontarem ou justifique.
3. Screenshots em 390×844 e 1440×900, tema claro e escuro: sem rolagem horizontal, sem texto cortado. **Se não conseguir renderizar a página (sem browser ou Playwright), diga isso. Não declare "pronto" sem ter visto.**
4. Contraste de 4,5:1 para texto nos dois temas; HTML semântico (`<button>`, `<a>`, um único `h1`, headings em ordem); `alt` nas imagens; navegação por teclado com foco visível.
5. Meta: Lighthouse mobile de 90 ou mais. Reporte o número real.

## Decisões em aberto (não decida sozinho)

- Voz da landing e headline do hero (testar "chamou, agendou." contra um headline que fale da dor).
- CTA principal da página: um só (lista de espera, demo ou WhatsApp).
- Preço e planos.
- Pacote de ícones.
- Tokens de movimento.
- Tamanho do `display` no hero desktop (o design system tem 40px).
- "kort for beauty" é variação futura: não implemente.