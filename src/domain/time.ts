import { Temporal } from "@js-temporal/polyfill";

// UTC in the database, America/Sao_Paulo on screen. The zone is used by name, never as a fixed
// offset, so a change in the rules (Brazil dropped DST in 2019) does not touch this code.

export const TIME_ZONE = "America/Sao_Paulo";

/** Start times offered to customers fall on this grid (09h00, 09h30, ...). */
export const SLOT_MINUTES = 30;

const WEEKDAY_NAMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export function instantFromDate(date: Date): Temporal.Instant {
  return Temporal.Instant.fromEpochMilliseconds(date.getTime());
}

/** Parses an ISO instant that carries an offset or Z ("2026-11-02T12:30:00Z"). */
export function parseInstant(iso: string): Temporal.Instant {
  return Temporal.Instant.from(iso);
}

export function toLocal(instant: Temporal.Instant): Temporal.ZonedDateTime {
  return instant.toZonedDateTimeISO(TIME_ZONE);
}

/**
 * Local wall-clock time to an instant: ("2026-11-02", "09:30") -> 2026-11-02T12:30:00Z.
 * Throws on a time that does not exist or is ambiguous in the zone.
 */
export function localToInstant(date: string, time: string): Temporal.Instant {
  return Temporal.PlainDateTime.from(`${date}T${time}`)
    .toZonedDateTime(TIME_ZONE, { disambiguation: "reject" })
    .toInstant();
}

export function addMinutes(instant: Temporal.Instant, minutes: number): Temporal.Instant {
  return instant.add({ minutes });
}

export function localDate(instant: Temporal.Instant): Temporal.PlainDate {
  return toLocal(instant).toPlainDate();
}

/** 0 = Sunday ... 6 = Saturday, the same numbering as business_hours.weekday in the database. */
export function weekdayIndex(date: Temporal.PlainDate): number {
  return date.dayOfWeek % 7;
}

/** "09h30" (always two digits for hour and minute). */
export function formatTime(instant: Temporal.Instant): string {
  const local = toLocal(instant);
  return `${String(local.hour).padStart(2, "0")}h${String(local.minute).padStart(2, "0")}`;
}

/** "quinta, 15/10". */
export function formatDate(instant: Temporal.Instant): string {
  const local = toLocal(instant);
  const day = String(local.day).padStart(2, "0");
  const month = String(local.month).padStart(2, "0");
  return `${WEEKDAY_NAMES[weekdayIndex(local.toPlainDate())]}, ${day}/${month}`;
}

export function isOnSlotGrid(instant: Temporal.Instant): boolean {
  const local = toLocal(instant);
  return local.second === 0 && local.millisecond === 0 && local.minute % SLOT_MINUTES === 0;
}
