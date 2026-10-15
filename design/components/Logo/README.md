Mostra o logo da kort: o wordmark com o o em balão e o r emendado no t, ou o ícone, que é o "ko" desse mesmo wordmark ampliado e recortado pelo quadrado.

- `variant="wordmark"` no topo do painel, na tela de login e em e-mails. Largura mínima 64px; respiro em volta igual à altura do o.
- `variant="icon"` quando não cabe o wordmark: barra lateral recolhida, avatar, ícone do app. Mínimo 24px.
- O wordmark herda `text` (currentColor): fica certo nos dois temas sem configurar nada. Só passe `color` sobre fundos de marca (`brand-creme` sobre `brand-couro`).
- O ícone usa `accent` de fundo e `on-accent` no traço, então troca sozinho entre couro (claro) e camurça (escuro).
- Não use o logo como botão de "voltar", não ponha texto colado nele, não mude o recorte do ícone e não pinte com cor de estado.
