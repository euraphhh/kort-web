import { DsIcon, type DsIconName } from "./ds-icon";

// StatusBadge, Counter e AppointmentRow do design system (design/components).
// Estado nunca só por cor: sempre ícone e palavra; "não confirmado" é tracejado.

export type AppointmentStatus = "scheduled" | "confirmed" | "unconfirmed" | "noshow" | "cancelled";

const statuses: Record<AppointmentStatus, { label: string; icon: DsIconName; className: string }> = {
  scheduled: { label: "Agendado", icon: "dot", className: "text-text-muted border-border-control" },
  confirmed: { label: "Confirmado", icon: "check", className: "text-state-confirmed border-current" },
  unconfirmed: { label: "Não confirmado", icon: "clock", className: "text-state-unconfirmed border-current border-dashed" },
  noshow: { label: "Faltou", icon: "x", className: "text-state-noshow border-current" },
  cancelled: { label: "Cancelado", icon: "ban", className: "text-state-cancelled border-current" },
};

export function StatusBadge({ status, label }: { status: AppointmentStatus; label?: string }) {
  const s = statuses[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border-[1.5px] px-2 py-0.5 text-small font-semibold whitespace-nowrap ${s.className}`}
    >
      <DsIcon name={s.icon} />
      {label ?? s.label}
    </span>
  );
}

export function Counter({ count, label }: { count: number; label: string }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-baseline gap-1 rounded-pill bg-accent-soft px-3 py-1 text-small font-semibold text-accent-strong">
      <span className="tabular font-bold">{count}</span>
      {label}
    </span>
  );
}

export function AppointmentRow({
  time,
  service,
  client,
  professional,
  status = "scheduled",
}: {
  time: string;
  service: string;
  client: string;
  professional?: string;
  status?: AppointmentStatus;
}) {
  const cancelled = status === "cancelled";
  return (
    <div className="grid min-h-target-min grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-t border-border py-3 first:border-t-0">
      <span className={`tabular w-8 text-time ${cancelled ? "text-state-cancelled line-through" : ""}`}>{time}</span>
      <div className="min-w-0">
        <p className={`truncate text-body-strong ${cancelled ? "text-state-cancelled line-through" : ""}`}>{service}</p>
        <p className="truncate text-small text-text-muted">
          {professional ? `${client} · com ${professional}` : client}
        </p>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}
