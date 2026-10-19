import { describe, expect, it } from "vitest";
import type { BusyAppointment, Interval } from "../../../src/domain/availability";
import { domainErrorFromDb } from "../../../src/domain/errors";
import {
  planBooking,
  planCancel,
  planClose,
  planReschedule,
  type Actor,
  type BookingInput,
  type CancelInput,
  type CloseInput,
  type ExistingAppointment,
  type RescheduleInput,
  type Result,
} from "../../../src/domain/scheduling";
import { localToInstant } from "../../../src/domain/time";

// 2026-11-02 is a Monday. The shop opens Mon 09h-12h and 13h-18h.
const at = (time: string, date = "2026-11-02") => localToInstant(date, time);
const range = (from: string, to: string): Interval => ({ start: at(from), end: at(to) });
const busy = (from: string, to: string, extra: Partial<BusyAppointment> = {}): BusyAppointment => ({
  ...range(from, to),
  status: "scheduled",
  ...extra,
});

const HOURS = [
  { weekday: 1, startTime: "09:00:00", endTime: "12:00:00" },
  { weekday: 1, startTime: "13:00:00", endTime: "18:00:00" },
];
const RULES = { minNoticeMinutes: 30, maxAdvanceDays: 30, businessHours: HOURS };
const NOW = localToInstant("2026-11-01", "09:00"); // Sunday morning

const agent: Actor = { role: "agent" };
const owner: Actor = { role: "owner" };
const barber: Actor = { role: "barber", professionalId: "joao" };

function booking(overrides: Partial<BookingInput> = {}): BookingInput {
  return {
    actor: agent,
    now: NOW,
    start: at("10:00"),
    rules: RULES,
    professional: { id: "joao", active: true, hours: HOURS, doesService: true },
    service: { id: "corte", active: true, durationMinutes: 30, priceCents: 4500 },
    customer: { id: "maria", active: true },
    appointments: [],
    blocks: [],
    ...overrides,
  };
}

const errorOf = <T>(result: Result<T>) => (result.ok ? null : result.error.code);
const warningsOf = <T>(result: Result<T>) => (result.ok ? result.warnings : []);

describe("planBooking: the plan", () => {
  it("copies price and duration from the service and sets the source", () => {
    const result = planBooking(booking());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      professionalId: "joao",
      customerId: "maria",
      serviceId: "corte",
      priceCents: 4500,
      durationMinutes: 30,
      source: "agent",
    });
    expect(result.value.startsAt.toString()).toBe(at("10:00").toString());
    expect(result.value.endsAt.toString()).toBe(at("10:30").toString());
    expect(result.warnings).toEqual([]);
  });

  it("ends according to the real duration of the service", () => {
    const result = planBooking(
      booking({ service: { id: "combo", active: true, durationMinutes: 45, priceCents: 7000 } }),
    );
    expect(result.ok && result.value.endsAt.toString()).toBe(at("10:45").toString());
  });

  it("marks panel bookings as 'panel'", () => {
    const result = planBooking(booking({ actor: owner }));
    expect(result.ok && result.value.source).toBe("panel");
  });
});

describe("planBooking: who and what can be booked", () => {
  it("refuses an inactive professional, service or customer", () => {
    expect(errorOf(planBooking(booking({ professional: { id: "joao", active: false, hours: HOURS, doesService: true } })))).toBe("professional_inactive");
    expect(errorOf(planBooking(booking({ service: { id: "corte", active: false, durationMinutes: 30, priceCents: 4500 } })))).toBe("service_inactive");
    expect(errorOf(planBooking(booking({ customer: { id: "maria", active: false } })))).toBe("customer_inactive");
  });

  it("refuses a professional who does not do the service", () => {
    expect(errorOf(planBooking(booking({ professional: { id: "joao", active: true, hours: HOURS, doesService: false } })))).toBe("professional_does_not_do_service");
  });

  it("refuses a barber booking on someone else's agenda", () => {
    expect(errorOf(planBooking(booking({ actor: { role: "barber", professionalId: "pedro" } })))).toBe("not_allowed");
    expect(planBooking(booking({ actor: barber })).ok).toBe(true);
  });
});

describe("planBooking: the agent follows every rule", () => {
  it("refuses a taken slot", () => {
    expect(errorOf(planBooking(booking({ appointments: [busy("10:00", "10:30")] })))).toBe("slot_unavailable");
    expect(errorOf(planBooking(booking({ appointments: [busy("09:45", "10:15")] })))).toBe("slot_unavailable");
  });

  it("accepts the slot of a cancelled appointment", () => {
    expect(planBooking(booking({ appointments: [busy("10:00", "10:30", { status: "cancelled" })] })).ok).toBe(true);
  });

  it("refuses a blocked time, a time off the grid and a time in the lunch break", () => {
    expect(errorOf(planBooking(booking({ blocks: [range("10:00", "11:00")] })))).toBe("slot_unavailable");
    expect(errorOf(planBooking(booking({ start: at("10:10") })))).toBe("slot_unavailable");
    expect(errorOf(planBooking(booking({ start: at("12:30") })))).toBe("slot_unavailable");
  });

  it("refuses a time inside the minimum notice", () => {
    const now = localToInstant("2026-11-02", "09:50");
    expect(errorOf(planBooking(booking({ now, start: at("10:00") })))).toBe("inside_min_notice");
  });

  it("refuses a day beyond the booking window", () => {
    const start = localToInstant("2026-12-07", "10:00"); // a Monday, 36 days ahead
    expect(errorOf(planBooking(booking({ start })))).toBe("beyond_booking_window");
  });
});

describe("planBooking: people skip the customer-facing limits and get warnings", () => {
  it.each([["owner", owner], ["barber", barber]] as const)("%s can book inside the minimum notice", (_name, actor) => {
    const now = localToInstant("2026-11-02", "09:50");
    const result = planBooking(booking({ actor, now, start: at("10:00") }));
    expect(result.ok).toBe(true);
    expect(warningsOf(result)).toEqual([]);
  });

  it("warns about a time outside the business hours", () => {
    const result = planBooking(booking({ actor: owner, start: at("20:00") }));
    expect(result.ok).toBe(true);
    expect(warningsOf(result)).toEqual(["outside_business_hours", "outside_professional_hours"]);
  });

  it("warns about a time in the lunch break", () => {
    expect(warningsOf(planBooking(booking({ actor: owner, start: at("12:30") })))).toContain("outside_business_hours");
  });

  it("warns, but books, over a block", () => {
    const result = planBooking(booking({ actor: owner, blocks: [range("10:00", "11:00")] }));
    expect(result.ok).toBe(true);
    expect(warningsOf(result)).toEqual(["over_block"]);
  });

  it("warns about a time in the past", () => {
    const now = localToInstant("2026-11-02", "15:00");
    expect(warningsOf(planBooking(booking({ actor: owner, now, start: at("10:00") })))).toEqual(["in_the_past"]);
  });

  it("never books over another appointment", () => {
    expect(errorOf(planBooking(booking({ actor: owner, appointments: [busy("10:00", "10:30")] })))).toBe("slot_unavailable");
    expect(errorOf(planBooking(booking({ actor: barber, appointments: [busy("09:45", "10:15")] })))).toBe("slot_unavailable");
  });
});

const existing: ExistingAppointment = {
  id: "ap1",
  professionalId: "joao",
  customerId: "maria",
  serviceId: "corte",
  status: "scheduled",
  startsAt: at("10:00"),
  priceCents: 4500,
  durationMinutes: 30,
};

function reschedule(overrides: Partial<RescheduleInput> = {}): RescheduleInput {
  return {
    actor: agent,
    now: NOW,
    start: at("15:00"),
    rules: RULES,
    cancelLimitMinutes: 120,
    appointment: existing,
    professional: { id: "joao", active: true, hours: HOURS, doesService: true },
    appointments: [busy("10:00", "10:30", { id: "ap1" })],
    blocks: [],
    ...overrides,
  };
}

describe("planReschedule", () => {
  it("moves the appointment and keeps its price and duration", () => {
    const result = planReschedule(
      reschedule({ appointment: { ...existing, priceCents: 4000, durationMinutes: 45 } }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.startsAt.toString()).toBe(at("15:00").toString());
    expect(result.value.endsAt.toString()).toBe(at("15:45").toString());
    expect(result.value).toMatchObject({ priceCents: 4000, durationMinutes: 45, customerId: "maria", serviceId: "corte" });
  });

  it("does not conflict with itself (moving by a few minutes within its own slot)", () => {
    expect(planReschedule(reschedule({ start: at("10:00") })).ok).toBe(true);
    expect(planReschedule(reschedule({ start: at("10:30") })).ok).toBe(true);
  });

  it("refuses a taken new time, leaving the original as it was", () => {
    const result = planReschedule(reschedule({ appointments: [busy("10:00", "10:30", { id: "ap1" }), busy("15:00", "15:30", { id: "ap2" })] }));
    expect(errorOf(result)).toBe("slot_unavailable");
  });

  it("makes the agent stop at the cancel limit (it hands over to a person)", () => {
    const now = localToInstant("2026-11-02", "08:30"); // 1h30 before 10h00
    expect(errorOf(planReschedule(reschedule({ now })))).toBe("too_late_to_reschedule");
    const early = localToInstant("2026-11-02", "07:30"); // exactly 2h30 before
    expect(planReschedule(reschedule({ now: early })).ok).toBe(true);
  });

  it("lets the owner and the barber reschedule inside the limit", () => {
    const now = localToInstant("2026-11-02", "09:50");
    expect(planReschedule(reschedule({ actor: owner, now })).ok).toBe(true);
    expect(planReschedule(reschedule({ actor: barber, now })).ok).toBe(true);
  });

  it("only moves a scheduled appointment", () => {
    for (const status of ["completed", "cancelled", "no_show"] as const) {
      expect(errorOf(planReschedule(reschedule({ appointment: { ...existing, status } })))).toBe("invalid_status_transition");
    }
  });

  it("keeps a barber on their own agenda", () => {
    const other = { role: "barber", professionalId: "pedro" } as const;
    expect(errorOf(planReschedule(reschedule({ actor: other })))).toBe("not_allowed");
    expect(errorOf(planReschedule(reschedule({ actor: barber, professional: { id: "pedro", active: true, hours: HOURS, doesService: true } })))).toBe("not_allowed");
  });

  it("refuses an inactive professional or one who does not do the service", () => {
    expect(errorOf(planReschedule(reschedule({ professional: { id: "joao", active: false, hours: HOURS, doesService: true } })))).toBe("professional_inactive");
    expect(errorOf(planReschedule(reschedule({ professional: { id: "joao", active: true, hours: HOURS, doesService: false } })))).toBe("professional_does_not_do_service");
  });
});

function cancel(overrides: Partial<CancelInput> = {}): CancelInput {
  return { actor: agent, now: NOW, cancelLimitMinutes: 120, appointment: existing, ...overrides };
}

describe("planCancel", () => {
  it("cancels a scheduled appointment", () => {
    const result = planCancel(cancel());
    expect(result.ok && result.value).toEqual({ status: "cancelled" });
  });

  it("makes the agent stop at the limit, but not the owner or the barber", () => {
    const now = localToInstant("2026-11-02", "08:30");
    expect(errorOf(planCancel(cancel({ now })))).toBe("too_late_to_cancel");
    expect(planCancel(cancel({ now, actor: owner })).ok).toBe(true);
    expect(planCancel(cancel({ now, actor: barber })).ok).toBe(true);
  });

  it("the limit is inclusive: exactly 2h before is still fine", () => {
    expect(planCancel(cancel({ now: localToInstant("2026-11-02", "08:00") })).ok).toBe(true);
    expect(errorOf(planCancel(cancel({ now: localToInstant("2026-11-02", "08:01") })))).toBe("too_late_to_cancel");
  });

  it("only cancels a scheduled appointment", () => {
    for (const status of ["completed", "cancelled", "no_show"] as const) {
      expect(errorOf(planCancel(cancel({ appointment: { ...existing, status } })))).toBe("invalid_status_transition");
    }
  });

  it("keeps a barber on their own agenda", () => {
    expect(errorOf(planCancel(cancel({ actor: { role: "barber", professionalId: "pedro" } })))).toBe("not_allowed");
  });
});

function close(overrides: Partial<CloseInput> = {}): CloseInput {
  return {
    actor: barber,
    now: localToInstant("2026-11-02", "10:15"),
    outcome: "no_show",
    appointment: existing,
    ...overrides,
  };
}

describe("planClose", () => {
  it("closes from the start time on", () => {
    expect(planClose(close({ now: at("10:00") })).ok).toBe(true);
    const result = planClose(close({ now: at("10:15"), outcome: "completed" }));
    expect(result.ok && result.value).toEqual({ status: "completed", autoClosed: false });
  });

  it("does not close an appointment that has not started", () => {
    expect(errorOf(planClose(close({ now: at("09:59") })))).toBe("too_early_to_close");
  });

  it("is never done by the agent", () => {
    expect(errorOf(planClose(close({ actor: agent })))).toBe("not_allowed");
  });

  it("keeps a barber on their own agenda", () => {
    expect(errorOf(planClose(close({ actor: { role: "barber", professionalId: "pedro" } })))).toBe("not_allowed");
  });

  it("once closed, only the owner corrects it, and only between the two outcomes", () => {
    const closed = { ...existing, status: "completed" as const };
    expect(planClose(close({ actor: owner, appointment: closed, outcome: "no_show" })).ok).toBe(true);
    expect(errorOf(planClose(close({ actor: barber, appointment: closed, outcome: "no_show" })))).toBe("not_allowed");
    expect(errorOf(planClose(close({ actor: owner, appointment: closed, outcome: "completed" })))).toBe("invalid_status_transition");
  });

  it("cancelled is final", () => {
    const cancelled = { ...existing, status: "cancelled" as const };
    expect(errorOf(planClose(close({ actor: owner, appointment: cancelled })))).toBe("invalid_status_transition");
  });
});

describe("domainErrorFromDb", () => {
  it("turns the exclusion violation into 'slot_unavailable'", () => {
    expect(domainErrorFromDb({ code: "23P01" })?.code).toBe("slot_unavailable");
  });

  it("ignores any other database error", () => {
    expect(domainErrorFromDb({ code: "23505" })).toBeNull();
    expect(domainErrorFromDb(null)).toBeNull();
    expect(domainErrorFromDb(undefined)).toBeNull();
  });
});
