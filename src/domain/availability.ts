import { Temporal } from "@js-temporal/polyfill";
import { SLOT_MINUTES, localDate, localToInstant, toLocal, weekdayIndex } from "./time";

// Availability of a professional, as pure functions: the caller reads the data from the database
// and hands it over. The database stays the final authority (exclusion constraint); this decides
// what is worth offering, in one place for the panel and the agent.

/** How many alternative times are offered when the requested one is taken. */
export const ALTERNATIVES_COUNT = 3;

/** A recurring interval as stored in business_hours and professional_hours. */
export type WeeklyInterval = {
  weekday: number; // 0 = Sunday ... 6 = Saturday
  startTime: string; // "09:00" or "09:00:00"
  endTime: string;
};

/** Half-open interval [start, end). */
export type Interval = { start: Temporal.Instant; end: Temporal.Instant };

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type BusyAppointment = Interval & { status: AppointmentStatus };

export type AvailabilityInput = {
  /** Local calendar day to compute. */
  date: Temporal.PlainDate;
  now: Temporal.Instant;
  businessHours: WeeklyInterval[];
  professionalHours: WeeklyInterval[];
  professionalActive: boolean;
  /** Real duration of the service, in minutes. */
  durationMinutes: number;
  minNoticeMinutes: number;
  /** How far ahead a customer can book, counted in days from today. */
  maxAdvanceDays: number;
  /** All appointments of this professional around that day. Cancelled ones are ignored. */
  appointments: BusyAppointment[];
  blocks: Interval[];
};

const before = (a: Temporal.Instant, b: Temporal.Instant) => Temporal.Instant.compare(a, b) < 0;
const after = (a: Temporal.Instant, b: Temporal.Instant) => Temporal.Instant.compare(a, b) > 0;
const later = (a: Temporal.Instant, b: Temporal.Instant) => (after(a, b) ? a : b);
const earlier = (a: Temporal.Instant, b: Temporal.Instant) => (before(a, b) ? a : b);

/** The weekly intervals of that weekday as instants on `date`, sorted and merged. */
function windowsOn(date: Temporal.PlainDate, weekly: WeeklyInterval[]): Interval[] {
  const day = weekdayIndex(date);
  const intervals = weekly
    .filter((w) => w.weekday === day)
    .map((w) => ({
      start: localToInstant(date.toString(), w.startTime),
      end: localToInstant(date.toString(), w.endTime),
    }))
    .filter((w) => before(w.start, w.end))
    .sort((a, b) => Temporal.Instant.compare(a.start, b.start));

  const merged: Interval[] = [];
  for (const interval of intervals) {
    const last = merged[merged.length - 1];
    if (last && !before(last.end, interval.start)) {
      last.end = later(last.end, interval.end);
    } else {
      merged.push({ ...interval });
    }
  }
  return merged;
}

/** Overlap between two sorted, non-overlapping lists of intervals. */
function intersect(a: Interval[], b: Interval[]): Interval[] {
  const result: Interval[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const start = later(a[i].start, b[j].start);
    const end = earlier(a[i].end, b[j].end);
    if (before(start, end)) result.push({ start, end });
    if (before(a[i].end, b[j].end)) i++;
    else j++;
  }
  return result;
}

function cut(window: Interval, busy: Interval): Interval[] {
  if (!before(busy.start, window.end) || !after(busy.end, window.start)) return [window];
  const pieces: Interval[] = [];
  if (after(busy.start, window.start)) pieces.push({ start: window.start, end: busy.start });
  if (before(busy.end, window.end)) pieces.push({ start: busy.end, end: window.end });
  return pieces;
}

function subtract(windows: Interval[], busy: Interval[]): Interval[] {
  return busy.reduce((free, item) => free.flatMap((w) => cut(w, item)), windows);
}

/** Next time on the 30 minute grid at or after `instant`, in local time. */
function roundUpToGrid(instant: Temporal.Instant): Temporal.Instant {
  return toLocal(instant)
    .round({ smallestUnit: "minute", roundingIncrement: SLOT_MINUTES, roundingMode: "ceil" })
    .toInstant();
}

/**
 * Start times a professional can be booked for a service on a day, in order.
 *
 * Free time = the professional's hours inside the business hours, minus appointments (cancelled
 * ones free the slot) and blocks. Start times fall on the 30 minute grid and the WHOLE service,
 * with its real duration, has to fit inside one free window (so it cannot span the lunch break).
 */
export function availableSlots(input: AvailabilityInput): Temporal.Instant[] {
  const { durationMinutes } = input;
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    throw new RangeError(`Invalid service duration: ${durationMinutes}`);
  }
  if (!input.professionalActive) return [];

  const lastBookableDay = localDate(input.now).add({ days: input.maxAdvanceDays });
  if (Temporal.PlainDate.compare(input.date, lastBookableDay) > 0) return [];

  const open = intersect(
    windowsOn(input.date, input.businessHours),
    windowsOn(input.date, input.professionalHours),
  );
  const busy: Interval[] = [
    ...input.appointments.filter((a) => a.status !== "cancelled"),
    ...input.blocks,
  ];
  const free = subtract(open, busy);

  const earliestStart = input.now.add({ minutes: input.minNoticeMinutes });
  const duration = { minutes: durationMinutes };
  const slots: Temporal.Instant[] = [];

  for (const window of free) {
    let start = roundUpToGrid(later(window.start, earliestStart));
    while (!after(start.add(duration), window.end)) {
      slots.push(start);
      start = start.add({ minutes: SLOT_MINUTES });
    }
  }
  return slots;
}

/** Whether a requested start time can be booked. Same rules as availableSlots, one source. */
export function isSlotAvailable(input: AvailabilityInput, start: Temporal.Instant): boolean {
  return availableSlots(input).some((slot) => slot.equals(start));
}

export type ProfessionalSlot = { professionalId: string; start: Temporal.Instant };

/** Free start times across several professionals, ordered by time and then by professional id. */
export function findSlots(
  professionals: { professionalId: string; input: AvailabilityInput }[],
): ProfessionalSlot[] {
  return professionals
    .flatMap(({ professionalId, input }) =>
      availableSlots(input).map((start) => ({ professionalId, start })),
    )
    .sort(
      (a, b) =>
        Temporal.Instant.compare(a.start, b.start) || a.professionalId.localeCompare(b.professionalId),
    );
}

export type ProfessionalCandidate = {
  professionalId: string;
  /** This customer was already served by this professional. */
  servedCustomerBefore: boolean;
  /** Active appointments the professional already has that day. */
  appointmentsThatDay: number;
  /** Registration order, lowest first. Last tie-break so the result is always the same. */
  order: number;
};

/**
 * "No preference" from the customer: a deterministic choice among professionals who are free at
 * the requested time. Prefers who already served the customer, then who is least busy that day,
 * then registration order. The agent calls this; it never decides on its own.
 */
export function pickProfessional(candidates: ProfessionalCandidate[]): string | null {
  const ranked = [...candidates].sort(
    (a, b) =>
      Number(b.servedCustomerBefore) - Number(a.servedCustomerBefore) ||
      a.appointmentsThatDay - b.appointmentsThatDay ||
      a.order - b.order,
  );
  return ranked[0]?.professionalId ?? null;
}

/**
 * Times to offer when the requested one is taken: the closest free ones on the requested day and
 * the next day, before or after, returned in chronological order. Ties go to the earlier time.
 */
export function nearestSlots(
  requested: Temporal.Instant,
  slots: Temporal.Instant[],
  count: number = ALTERNATIVES_COUNT,
): Temporal.Instant[] {
  const day = localDate(requested);
  const nextDay = day.add({ days: 1 });
  const distance = (slot: Temporal.Instant) =>
    Math.abs(slot.epochMilliseconds - requested.epochMilliseconds);

  return slots
    .filter((slot) => {
      const slotDay = localDate(slot);
      return slotDay.equals(day) || slotDay.equals(nextDay);
    })
    .filter((slot) => !slot.equals(requested))
    .sort((a, b) => distance(a) - distance(b) || Temporal.Instant.compare(a, b))
    .slice(0, count)
    .sort((a, b) => Temporal.Instant.compare(a, b));
}
