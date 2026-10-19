---
name: revisar-ui
description: Use em todo PR que mexe em tela, componente ou estilo. Confere tokens, temas, responsivo e acessibilidade, e exige as capturas de tela.
---

# Revisar UI

Antes de ler, leia `design/README.md` e `design/tokens.json`. Se o design system contradiz uma skill genérica, o design system vence.

## Design system

- [ ] Só tokens: cor, tipografia, espaço, raio e sombra saem de `design/tokens.json`. Nenhum hex, px ou fonte solto.
- [ ] `src/styles/tokens.css` não foi editado à mão (é gerado por `npm run tokens`).
- [ ] Painel separa por borda, não por sombra (`shadow-overlay` só em camadas sobrepostas). Gradiente, blur e brilho só na landing.
- [ ] `accent` só para ação principal, link, item ativo e foco. Uma ação primária por seção.
- [ ] O que o design system não cobre (token, componente, estado) foi proposto e avisado, não improvisado.
- [ ] Logo só pelos SVGs de `public/brand/`.

## Conteúdo

- [ ] Interface em pt-BR, "você", frases curtas, sem gíria no painel, sem emoji. Horários no formato `09h30`. O nome é sempre **kort**, em minúsculas.
- [ ] Nada inventado: preço, número, depoimento. Use placeholders (`[PREÇO]`).

## Qualidade

- [ ] Tema claro e escuro funcionam.
- [ ] Alvo de toque de 44px ou mais, texto de 12px ou mais, anel de foco de 2px visível.
- [ ] Estado nunca só por cor: palavra e ícone.
- [ ] HTML semântico: `<button>`, `<a>`, um único `h1`, headings em ordem, `alt` nas imagens. Navegação por teclado.
- [ ] Contraste de 4,5:1 para texto nos dois temas.
- [ ] Server Components por padrão; `'use client'` só em folhas com estado ou animação.
- [ ] Animação só em `transform` e `opacity`, com `prefers-reduced-motion` respeitado.

## Capturas (obrigatórias)

Screenshots em **390×844** e **1440×900**, tema claro e escuro, sem rolagem horizontal e sem texto cortado. Se não conseguir renderizar a página, diga isso: não declare pronto sem ter visto.
