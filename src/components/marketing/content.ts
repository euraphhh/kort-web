// Textos da landing. Tudo aqui é PROPOSTA e precisa de aprovação do time.
// [ASSIM] marca conteúdo que ainda não existe. Só prometa o que está nas specs MVP.

import type { ChatLine } from "@/lib/motion";

export const cta = {
  label: "Entrar na lista do piloto",
  shortLabel: "Entrar na lista",
  // [DESTINO-DO-CTA]: formulário externo (ex.: Google Forms) ou wa.me do time.
  href: "#[DESTINO-DO-CTA]",
};

export const nav = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#assistente", label: "O assistente" },
  { href: "#painel", label: "Painel" },
  { href: "#perguntas", label: "Perguntas" },
];

export const hero = {
  // Em teste: tagline do design system contra a headline de dor (headlineAlt).
  headline: "chamou, agendou.",
  headlineAlt: "Cliente que espera resposta marca em outra barbearia.",
  lead: "O assistente da kort responde seus clientes no WhatsApp da barbearia e marca o horário direto na sua agenda. Sem app e sem link para o cliente.",
};

export const chat = {
  shop: "[BARBEARIA]",
  shopStatus: "assistente virtual",
  label: "Exemplo de conversa entre um cliente e o assistente no WhatsApp da barbearia",
  replay: "Ver de novo",
  skip: "Mostrar a conversa toda",
  lines: [
    { from: "client", text: "boa tarde, tem horário amanhã?" },
    {
      from: "assistant",
      text: "opa! eu sou o assistente virtual da [BARBEARIA]. amanhã tenho 17h30 e 19h30 com o João. qual fica melhor?",
    },
    { from: "client", text: "17h30" },
    { from: "assistant", text: "corte com o João, amanhã às 17h30. posso confirmar?" },
    { from: "client", text: "pode" },
    { from: "assistant", text: "fechou! tá marcado. te aviso antes." },
  ] satisfies ChatLine[],
  agenda: {
    title: "Agenda de amanhã",
    time: "17h30",
    service: "Corte",
    client: "[CLIENTE]",
    professional: "João",
  },
};

export const pain = {
  title: "Enquanto você corta, o WhatsApp não para.",
  items: [
    {
      title: "Resposta que demora perde o cliente",
      body: "Quem pergunta e não recebe resposta marca em outro lugar.",
    },
    {
      title: "Responder tira você da cadeira",
      body: "Cada mensagem entre um corte e outro é uma pausa no atendimento.",
    },
    {
      title: "Falta sem aviso deixa a cadeira vazia",
      body: "O horário fica reservado e ninguém aparece.",
    },
  ],
};

export const howItWorks = {
  title: "Como funciona",
  steps: [
    {
      title: "O cliente chama no WhatsApp",
      body: "Manda mensagem para a barbearia como sempre fez. Não precisa baixar nada nem abrir link.",
    },
    {
      title: "O assistente acha um horário livre",
      body: "Consulta a agenda de cada profissional, oferece opções e só marca depois que o cliente confirma.",
    },
    {
      title: "O horário cai na sua agenda",
      body: "Você vê no painel. Um dia antes o cliente recebe um lembrete para confirmar, e uma hora antes, um aviso.",
    },
  ],
};

export const assistant = {
  title: "O que o assistente faz",
  lead: "Ele cuida da conversa de agendamento. O resto continua com você.",
  features: [
    {
      icon: "calendar",
      title: "Agenda sem conflito",
      body: "Dois clientes nunca ficam com o mesmo horário. Se o pedido estiver ocupado, ele oferece os horários livres mais próximos.",
    },
    {
      icon: "repeat",
      title: "Remarca e cancela",
      body: "O cliente resolve na conversa, até duas horas antes do horário.",
    },
    {
      icon: "question",
      title: "Tira dúvidas",
      body: "Preço, duração, serviços, profissionais, endereço e horário de funcionamento, sempre do que você cadastrou. O que não está cadastrado ele não inventa.",
    },
    {
      icon: "bell",
      title: "Lembra o cliente",
      body: "Pede confirmação um dia antes e avisa uma hora antes. Quem não responde aparece como não confirmado, e nada é cancelado sozinho.",
    },
    {
      icon: "hand",
      title: "Passa a conversa para você",
      body: "Se não entender o cliente ou o assunto fugir do agendamento, ele para de responder e deixa um resumo do pedido para você.",
    },
    {
      icon: "user",
      title: "Reconhece quem já é cliente",
      body: "Importe sua lista de clientes e ele chama cada um pelo nome desde a primeira mensagem.",
    },
  ],
} as const;

export const panel = {
  title: "Seu dia numa tela só",
  lead: "A agenda do dia é a primeira coisa que você vê. Os contadores mostram o que falta fechar e quem ainda não confirmou.",
  points: [
    "Marque horário na mão quando o cliente ligar ou passar na porta.",
    "Feche o dia: marque quem compareceu e quem faltou.",
    "Cadastre profissionais, serviços e horário de funcionamento.",
    "Importe seus clientes por planilha (CSV).",
  ],
  mock: {
    label: "Exemplo da agenda do dia no painel da kort",
    title: "Hoje",
    subtitle: "quinta, 15/10 · todos",
    counters: [
      { count: 2, label: "a fechar" },
      { count: 1, label: "não confirmado" },
    ],
    rows: [
      { time: "08h00", service: "Corte", client: "Diego Souza", status: "noshow" },
      { time: "09h00", service: "Corte", client: "Pedro Alves", status: "confirmed" },
      { time: "09h30", service: "Barba", client: "Lucas Martins", status: "unconfirmed" },
      { time: "10h30", service: "Corte e barba", client: "Rafael Costa", professional: "João", status: "scheduled" },
      { time: "11h00", service: "Pézinho", client: "Caio Lima", status: "cancelled" },
    ],
  },
} as const;

export const faq = {
  title: "Perguntas frequentes",
  items: [
    {
      q: "O cliente precisa baixar algum app?",
      a: "Não. Ele conversa pelo WhatsApp, como já faz hoje.",
    },
    {
      q: "O cliente sabe que está falando com um assistente?",
      a: "Sim. O assistente sempre se apresenta como assistente virtual da barbearia.",
    },
    {
      q: "E se o assistente não entender o cliente?",
      a: "Depois de duas tentativas, ou se o cliente pedir para falar com uma pessoa, ele pausa a conversa e registra um resumo do pedido para você responder.",
    },
    {
      q: "Funciona com o número que eu já uso?",
      a: "[RESPOSTA: depende da validação da coexistência com o número atual da barbearia.]",
    },
    {
      q: "O assistente entende áudio?",
      a: "Por enquanto, não. Ele avisa que só consegue ler texto e pede para o cliente escrever.",
    },
    {
      q: "Ainda posso marcar horário pelo painel?",
      a: "Sim. Você agenda na mão quando o cliente ligar ou aparecer na barbearia.",
    },
    {
      q: "Quanto custa?",
      a: "[PREÇO]",
    },
  ],
};

export const finalCta = {
  title: "Quer a kort na sua barbearia?",
  lead: "Estamos chamando as primeiras barbearias para o piloto. [DETALHES-DO-PILOTO]",
};

export const footer = {
  tagline: "chamou, agendou.",
  links: [
    { href: "#[TERMOS]", label: "Termos de uso" },
    { href: "#[PRIVACIDADE]", label: "Privacidade" },
  ],
  copyright: "© 2026 kort",
};
