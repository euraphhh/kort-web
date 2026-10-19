import { Temporal } from "@js-temporal/polyfill";
import {
  fitsWithin,
  isSlotAvailable,
  overlaps,
  weeklyWindowsOn,
  type AppointmentStatus,
  type AvailabilityInput,
  type BusyAppointment,
  type Interval,
  type WeeklyInterval,
} from "./availability";
import { DomainError, type DomainErrorCode } from "./errors";
import { localDate } from "./time";

// Book, reschedule, cancel and close, as plans: each function checks the rules and returns WHAT TO
// WRITE (or a domain error). The caller writes it in a single INSERT or UPDATE, so a reschedule
// that fails leaves the original untouched, and the database (exclusion constraint) has the last say.

export type Actor =
  | { role: "agent" }
  | { role: "owner" }
  | { role: "barber"; professionalId: string };

/** The panel can book anyway but should tell the owner about these. */
export type Warning =
  | "outside_business_hours"
  | "outside_professional_hours"
  | "over_block"
  | "in_the_past";

export type Result<T> =
  | { ok: true; value: T; warnings: Warning[] }
  | { ok: false; error: DomainError };

const ok = <T>(value: T, warnings: Warning[] = []): Result<T> => ({ ok: true, value, warnings });
const fail = <T>(code: DomainErrorCode): Result<T> => ({ ok: false, error: new DomainError(code) });

const isBefore = (a: Temporal.Instant, b: Temporal.Instant) => Temporal.Instant.compare(a, b) < 0;

function barberOutsideOwnAgenda(actor: Actor, professionalId: string): boolean {
  return actor.role === "barber" && actor.professionalId !== professionalId;
}

export type ScheduleRules = {
  minNoticeMinutes: number;
  maxAdvanceDays: number;
  businessHours: WeeklyInterval[];
};

type SlotCheck = {
  actor: Actor;
  now: Temporal.Instant;
  start: Temporal.Instant;
  durationMinutes: number;
  rules: ScheduleRules;
  professionalHours: WeeklyInterval[];
  appointments: BusyAppointment[];
  blocks: Interval[];
};

/** Overbooking and, for the agent, the full availability rules. People get warnings instead. */
function checkSlot(c: SlotCheck): Result<Interval> {
  const slot: Interval = { start: c.start, end: c.start.add({ minutes: c.durationMinutes }) };

  if (c.appointments.some((a) => a.status !== "cancelled" && overlaps(a, slot))) {
    return fail("slot_unavailable");
  }

  const date = localDate(c.start);

  if (c.actor.role === "agent") {
    const availability: AvailabilityInput = {
      date,
      now: c.now,
      businessHours: c.rules.businessHours,
      professionalHours: c.professionalHours,
      professionalActive: true,
      durationMinutes: c.durationMinutes,
      minNoticeMinutes: c.rules.minNoticeMinutes,
      maxAdvanceDays: c.rules.maxAdvanceDays,
      appointments: c.appointments,
      blocks: c.blocks,
    };
    if (isSlotAvailable(availability, c.start)) return ok(slot);

    if (isBefore(c.start, c.now.add({ minutes: c.rules.minNoticeMinutes }))) {
      return fail("inside_min_notice");
    }
    if (Temporal.PlainDate.compare(date, localDate(c.now).add({ days: c.rules.maxAdvanceDays })) > 0) {
      return fail("beyond_booking_window");
    }
    return fail("slot_unavailable");
  }

  const warnings: Warning[] = [];
  if (!fitsWithin(weeklyWindowsOn(date, c.rules.businessHours), slot)) {
    warnings.push("outside_business_hours");
  }
  if (!fitsWithin(weeklyWindowsOn(date, c.professionalHours), slot)) {
    warnings.push("outside_professional_hours");
  }
  if (c.blocks.some((b) => overlaps(b, slot))) warnings.push("over_block");
  if (isBefore(c.start, c.now)) warnings.push("in_the_past");
  return ok(slot, warnings);
}

// booking ---------------------------------------------------------------------

export type BookingInput = {
  actor: Actor;
  now: Temporal.Instant;
  start: Temporal.Instant;
  rules: ScheduleRules;
  professional: { id: string; active: boolean; hours: WeeklyInterval[]; doesService: boolean };
  service: { id: string; active: boolean; durationMinutes: number; priceCents: number };
  customer: { id: string; active: boolean };
  /** Appointments of this professional around that day. */
  appointments: BusyAppointment[];
  blocks: Interval[];
};

/** What to insert. Price and duration are copied from the service now and never change later. */
export type BookingPlan = {
  professionalId: string;
  customerId: string;
  serviceId: string;
  startsAt: Temporal.Instant;
  endsAt: Temporal.Instant;
  priceCents: number;
  durationMinutes: number;
  source: "agent" | "panel";
};

export function planBooking(input: BookingInput): Result<BookingPlan> {
  const { actor, professional, service, customer } = input;

  if (barberOutsideOwnAgenda(actor, professional.id)) return fail("not_allowed");
  if (!professional.active) return fail("professional_inactive");
  if (!service.active) return fail("service_inactive");
  if (!professional.doesService) return fail("professional_does_not_do_service");
  if (!customer.active) return fail("customer_inactive");

  const slot = checkSlot({
    actor,
    now: input.now,
    start: input.start,
    durationMinutes: service.durationMinutes,
    rules: input.rules,
    professionalHours: professional.hours,
    appointments: input.appointments,
    blocks: input.blocks,
  });
  if (!slot.ok) return slot;

  return ok(
    {
      professionalId: professional.id,
      customerId: customer.id,
      serviceId: service.id,
      startsAt: slot.value.start,
      endsAt: slot.value.end,
      priceCents: service.priceCents,
      durationMinutes: service.durationMinutes,
      source: actor.role === "agent" ? "agent" : "panel",
    },
    slot.warnings,
  );
}

// existing appointments -------------------------------------------------------------

export type ExistingAppointment = {
  id: string;
  professionalId: string;
  customerId: string;
  serviceId: string;
  status: AppointmentStatus;
  startsAt: Temporal.Instant;
  priceCents: number;
  durationMinutes: number;
};

export type ReschedulePlan = Omit<BookingPlan, "source">;

export type RescheduleInput = {
  actor: Actor;
  now: Temporal.Instant;
  /** The new start time. */
  start: Temporal.Instant;
  rules: ScheduleRules;
  cancelLimitMinutes: number;
  appointment: ExistingAppointment;
  /** The professional the appointment will be with (usually the same one). */
  professional: { id: string; active: boolean; hours: WeeklyInterval[]; doesService: boolean };
  appointments: BusyAppointment[];
  blocks: Interval[];
};

/**
 * A reschedule is a single operation: the plan is applied with one UPDATE, so if the new time is
 * refused (here or by the database) the original stays as it was. It keeps the price and the
 * duration the appointment was booked with.
 */
export function planReschedule(input: RescheduleInput): Result<ReschedulePlan> {
  const { actor, appointment, professional } = input;

  if (barberOutsideOwnAgenda(actor, appointment.professionalId)) return fail("not_allowed");
  if (barberOutsideOwnAgenda(actor, professional.id)) return fail("not_allowed");
  if (appointment.status !== "scheduled") return fail("invalid_status_transition");
  if (!professional.active) return fail("professional_inactive");
  if (!professional.doesService) return fail("professional_does_not_do_service");

  if (actor.role === "agent") {
    const limit = appointment.startsAt.subtract({ minutes: input.cancelLimitMinutes });
    if (isBefore(limit, input.now)) return fail("too_late_to_reschedule");
  }

  const slot = checkSlot({
    actor,
    now: input.now,
    start: input.start,
    durationMinutes: appointment.durationMinutes,
    rules: input.rules,
    professionalHours: professional.hours,
    // The appointment being moved must not conflict with itself.
    appointments: input.appointments.filter((a) => a.id !== appointment.id),
    blocks: input.blocks,
  });
  if (!slot.ok) return slot;

  return ok(
    {
      professionalId: professional.id,
      customerId: appointment.customerId,
      serviceId: appointment.serviceId,
      startsAt: slot.value.start,
      endsAt: slot.value.end,
      priceCents: appointment.priceCents,
      durationMinutes: appointment.durationMinutes,
    },
    slot.warnings,
  );
}

export type CancelInput = {
  actor: Actor;
  now: Temporal.Instant;
  cancelLimitMinutes: number;
  appointment: Pick<ExistingAppointment, "professionalId" | "status" | "startsAt">;
};

export function planCancel(input: CancelInput): Result<{ status: "cancelled" }> {
  const { actor, appointment } = input;

  if (barberOutsideOwnAgenda(actor, appointment.professionalId)) return fail("not_allowed");
  if (appointment.status !== "scheduled") return fail("invalid_status_transition");

  if (actor.role === "agent") {
    const limit = appointment.startsAt.subtract({ minutes: input.cancelLimitMinutes });
    if (isBefore(limit, input.now)) return fail("too_late_to_cancel");
  }
  return ok({ status: "cancelled" });
}

export type CloseInput = {
  actor: Actor;
  now: Temporal.Instant;
  outcome: "completed" | "no_show";
  appointment: Pick<ExistingAppointment, "professionalId" | "status" | "startsAt">;
};

/**
 * Marks an appointment as attended or no-show. It can be done from the start time on. Once closed,
 * only the owner can correct it, and only between the two outcomes; cancelled is final.
 */
export function planClose(input: CloseInput): Result<{ status: "completed" | "no_show"; autoClosed: false }> {
  const { actor, appointment, outcome } = input;

  if (actor.role === "agent") return fail("not_allowed");
  if (barberOutsideOwnAgenda(actor, appointment.professionalId)) return fail("not_allowed");

  if (appointment.status === "scheduled") {
    if (isBefore(input.now, appointment.startsAt)) return fail("too_early_to_close");
    return ok({ status: outcome, autoClosed: false });
  }

  if (appointment.status === "completed" || appointment.status === "no_show") {
    if (appointment.status === outcome) return fail("invalid_status_transition");
    if (actor.role !== "owner") return fail("not_allowed");
    return ok({ status: outcome, autoClosed: false });
  }

  return fail("invalid_status_transition");
}
