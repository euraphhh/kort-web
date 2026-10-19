-- How many days ahead a customer can book. Configurable by the owner, 30 days by default.
-- Spec: docs/specs/painel-configuracoes-da-barbearia.md, agente-agendar-horario.md
alter table public.barbershop
  add column max_advance_days integer not null default 30
  check (max_advance_days between 1 and 365);

-- The owner edits it like the other schedule rules (the WhatsApp columns stay team-only).
grant update (max_advance_days) on public.barbershop to authenticated;
