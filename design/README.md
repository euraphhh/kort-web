kort é o sistema de agendamento para barbearias com um assistente de IA no WhatsApp. **chamou, agendou.** A marca é minimalista, amigável e se comporta como parceira do barbeiro: some da frente quando ele está trabalhando e aparece clara quando ele precisa decidir algo. "Premium" aqui quer dizer acabamento e clareza, nunca luxo, ouro ou preto com dourado.

Quem vê a marca é o dono da barbearia e os barbeiros, no painel (web, mobile-first). O cliente final fala com o assistente pelo número de WhatsApp da própria barbearia e quase não vê a kort.

## Conteúdo e voz

Há duas vozes, com a mesma personalidade: direta, simpática, curta.

**Painel (fala com o dono e o barbeiro):** português brasileiro, frases normais com maiúscula no início, "você". Rótulos curtos e com verbo: "Novo agendamento", "Marcar como compareceu", "Inativar serviço". Sem gíria no painel. Datas como "quinta, 15/10"; horas sempre no formato **09h30**, nunca 09:30. Sem emoji na interface.

**Assistente (fala com o cliente final no WhatsApp):** segue o guia "Tom de voz do assistente" do Notion. Resumo:

- minúsculas no corpo da mensagem, nomes próprios com grafia correta (João, Holky Barbearia);
- gírias leves e nacionais (opa, fechou, de boa, bora), nunca em erro, cancelamento ou cobrança;
- no máximo um emoji, só em momento leve;
- sempre se apresenta como assistente virtual.

> opa! eu sou o assistente virtual da [nome da barbearia]. como posso te ajudar hoje?
> fechou! corte com o João, amanhã às 18h. te aviso antes.

Nunca escreva "Prezado cliente", "Agradecemos a preferência" ou "Seu agendamento foi realizado com sucesso!".

O nome da marca é sempre **kort**, em minúsculas, também no começo de frase.

## Logo

O logo é a palavra **kort** desenhada em traço único e arredondado. Dois detalhes fazem dele um logo, não uma fonte: o **o vira balão de conversa** (o produto acontece no WhatsApp) e o **braço do r emenda na barra do t** num traço só.

- `kort-wordmark.svg`: tinta `brand-tinta`, sobre `brand-creme`, branco ou `bg` do tema claro.
- `kort-wordmark-creme.svg`: tinta `#F2EDE6`, sobre `bg` do tema escuro ou sobre `brand-couro`.
- `kort-icone.svg`: o próprio wordmark ampliado e recortado pelo quadrado, mostrando só o "ko", em branco sobre `brand-couro`, traço engrossado para 20. Ícone do app, favicon, avatar.
- `kort-icone-escuro.svg`: o mesmo recorte em `#141110` sobre `brand-camurca`, para fundos escuros.

O ícone não é um símbolo à parte: é uma janela no logo. Por isso a abertura animada parte dele, expande o couro pela tela e revela o "kort" inteiro.

Regras:

- Área de respiro em volta do wordmark: a altura do **o** (metade da altura do logo) em todos os lados.
- Tamanho mínimo do wordmark: 64px de largura na tela. Abaixo disso, use o ícone.
- O ícone funciona até 24px. Nunca mova o recorte: o k encostado à esquerda e o o vazando pela direita são o desenho.
- Não mude o traço, não separe o r do t, não coloque o logo em cor de estado, não aplique sombra, gradiente ou contorno, não troque por uma fonte.
- O wordmark é sempre de uma cor só. Nunca pinte o balão de outra cor.

## Cor

A paleta é "Couro": neutros quentes com um único acento marrom. Todas as cores da interface saem de tokens de papel, nunca de hex solto no código; o tema claro e o escuro trocam só os valores.

- Fundo da página em `bg`; cartões e a agenda em `surface-1`; campos e hover em `surface-2`.
- Texto em `text`; informação secundária em `text-muted`.
- `accent` só para a ação principal da tela, links, item ativo e anel de foco. Uma ação primária por tela.
- Contadores e chips selecionados: `accent-soft` com texto `accent-strong`.
- Divisórias em `border`; contorno de qualquer controle em `border-control` (a `border` sozinha não tem contraste para separar um campo).

**O acento nunca indica estado.** Os estados de agendamento têm cores próprias e sempre levam ícone e palavra, porque o "não confirmado" é da mesma família de cor do marrom e o verde e o vermelho têm a mesma luminosidade:

| Estado | Token | Forma |
| --- | --- | --- |
| Agendado | `text-muted` | contorno `border-control`, ponto |
| Confirmado / compareceu | `state-confirmed` | contorno sólido, check |
| Não confirmado | `state-unconfirmed` | contorno **tracejado**, relógio |
| Faltou | `state-noshow` | contorno sólido, X |
| Cancelado | `state-cancelled` | horário e serviço riscados, círculo cortado |

Ações destrutivas e erros usam `danger`.

**Variações futuras:** o "kort for beauty" troca só os valores de `accent`, `on-accent`, `accent-soft` e `accent-strong` (roxo). Antes de usar, recalcule o contraste e confira que o novo acento não colide com `state-noshow` nem com `state-confirmed`.

## Tipografia

Uma família só: **Manrope** (Google Fonts, pesos 400, 500, 600 e 700). Os terminais arredondados dela conversam com o traço do logo.

**Exceção da landing:** **Instrument Serif** itálico (token `font-serif`, em `tokens.landing.json`), só nas palavras de destaque dos títulos, como "atende." no hero. Nunca em corpo de texto, interface ou painel.

- Título de tela em `title`, um por tela; título de cartão em `heading`.
- Texto corrido em `body`; nomes de serviço, valores e rótulos de botão em `body-strong`.
- Horários da agenda em `time`, com números tabulares para a coluna alinhar.
- Nome do cliente e texto de etiqueta em `small`; rótulo de grupo em `overline` com `text-muted`.
- `display` só em marketing.

Nunca use texto abaixo de 12px, nem `caption` para informação de que o barbeiro precise.

## Espaço, forma e camadas

- Escala de 4px: `space-1` a `space-8`. Padding lateral de tela `space-4` no celular e `space-7` no desktop; padding de cartão `space-5`.
- Botões e campos em `radius-md`; cartões em `radius-lg`; etiquetas e chips em `radius-pill`. Nada é quadrado: o logo é arredondado e a interface também.
- Separe por borda, não por sombra. `shadow-overlay` só em diálogos, folhas e menus.
- Todo alvo de toque tem pelo menos `target-min` (44px): o barbeiro usa o painel com uma mão, entre um corte e outro.

## Layout

Mobile-first. No celular a agenda mostra um profissional por vez, com seletor no topo; no desktop, colunas lado a lado. A tela inicial é a agenda do dia com dois contadores no topo (a fechar e não confirmados). Sem dashboards no MVP.

## Foco e acessibilidade

- Anel de foco: 2px sólido em `focus-ring`, afastado 2px do elemento, em todo controle focável.
- Texto com 4,5:1 ou mais em todas as superfícies dos dois temas; os valores de cada token estão nas notas de uso.
- Estado nunca depende só de cor: sempre palavra mais ícone.

## Ícones

Ícones de traço, 16px (`icon-ui`) na interface, traço 1,8px, pontas e cantos arredondados, sempre em `currentColor`. Nenhum pacote de ícones foi escolhido ainda; os ícones das prévias são desenhados à mão no mesmo estilo. Ao adotar um pacote, prefira um de traço arredondado (por exemplo Lucide) e registre aqui. Sem emoji na interface.
