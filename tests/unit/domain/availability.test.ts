import { Temporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";
import {
  ALTERNATIVES_COUNT,
  availableSlots,
  findSlots,
  isSlotAvailable,
  nearestSlots,
  pickProfessional,
  type AvailabilityInput,
  type BusyAppointment,
  type Interval,
} from "../../../src/domain/availability";
import { formatTime, localToInstant } from "../../../src/domain/time";

// 2026-11-02 is a Monday. The shop opens Mon 09h-12h and 13h-18h.
const MONDAY = Temporal.PlainDate.from("2026-11-02");
const at = (time: string, date = "2026-11-02") => localToInstant(date, time);
const range = (from: string, to: string): Interval => ({ start: at(from), end: at(to) });
const appt = (from: string, to: string, status: BusyAppointment["status"] = "scheduled") => ({
  ...range(from, to),
  status,
});
const times = (slots: Temporal.Instant[]) => slots.map(formatTime);

const HOURS = [
  { weekday: 1, startTime: "09:00:00", endTime: "12:00:00" },
  { weekday: 1, startTime: "13:00:00", endTime: "18:00:00" },
];

function input(overrides: Partial<AvailabilityInput> = {}): AvailabilityInput {
  return {
    date: MONDAY,
    now: localToInstant("2026-11-01", "09:00"), // Sunday morning
    businessHours: HOURS,
    professionalHours: HOURS,
    professionalActive: true,
    durationMinutes: 30,
    minNoticeMinutes: 30,
    maxAdvanceDays: 30,
    appointments: [],
    blocks: [],
    ...overrides,
  };
}

const MORNING_30 = ["09h00", "09h30", "10h00", "10h30", "11h00", "11h30"];
const AFTERNOON_30 = [
  "13h00", "13h30", "14h00", "14h30", "15h00", "15h30", "16h00", "16h30", "17h00", "17h30",
];

describe("availableSlots: the grid and the service duration", () => {
  it("offers every 30 minutes while the service fits", () => {
    expect(times(availableSlots(input()))).toEqual([...MORNING_30, ...AFTERNOON_30]);
  });

  it("uses the real duration: a 45 minute service needs 45 free minutes", () => {
    const slots = times(availableSlots(input({ durationMinutes: 45 })));
    expect(slots).toEqual([
      "09h00", "09h30", "10h00", "10h30", "11h00",
      "13h00", "13h30", "14h00", "14h30", "15h00", "15h30", "16h00", "16h30", "17h00",
    ]);
  });

  it("keeps the 30 minute grid for a 20 minute service", () => {
    expect(times(availableSlots(input({ durationMinutes: 20 })))).toEqual([
      ...MORNING_30,
      ...AFTERNOON_30,
    ]);
  });

  it("never lets a service span the lunch break", () => {
    const slots = times(availableSlots(input({ durationMinutes: 90 })));
    expect(slots).toContain("10h30"); // 10h30 to 12h00
    expect(slots).not.toContain("11h00"); // would run into the break
    expect(slots).not.toContain("11h30");
    expect(slots).toContain("13h00");
  });

  it("refuses an invalid duration", () => {
    expect(() => availableSlots(input({ durationMinutes: 0 }))).toThrow(RangeError);
    expect(() => availableSlots(input({ durationMinutes: 30.5 }))).toThrow(RangeError);
  });
});

describe("availableSlots: appointments and blocks", () => {
  it("removes the time taken by an appointment", () => {
    const slots = times(availableSlots(input({ appointments: [appt("10:00", "10:30")] })));
    expect(slots).not.toContain("10h00");
    expect(slots).toContain("09h30");
    expect(slots).toContain("10h30");
  });

  it("removes a start time whose service would run into the next appointment", () => {
    const slots = times(
      availableSlots(input({ durationMinutes: 45, appointments: [appt("10:00", "10:30")] })),
    );
    expect(slots).not.toContain("09h30"); // 09h30 to 10h15 overlaps
    expect(slots).toContain("09h00"); // 09h00 to 09h45 fits
    expect(slots).toContain("10h30"); // starts right when the appointment ends
  });

  it("frees the slot of a cancelled appointment", () => {
    const slots = times(
      availableSlots(input({ appointments: [appt("10:00", "10:30", "cancelled")] })),
    );
    expect(slots).toContain("10h00");
  });

  it("treats every status except cancelled as taken", () => {
    for (const status of ["scheduled", "completed", "no_show"] as const) {
      const slots = times(availableSlots(input({ appointments: [appt("10:00", "10:30", status)] })));
      expect(slots).not.toContain("10h00");
    }
  });

  it("removes the time of a block", () => {
    const slots = times(availableSlots(input({ blocks: [range("13:00", "14:00")] })));
    expect(slots).not.toContain("13h00");
    expect(slots).not.toContain("13h30");
    expect(slots).toContain("14h00");
  });

  it("handles a block that starts inside an appointment", () => {
    const slots = times(
      availableSlots(
        input({ appointments: [appt("10:00", "10:30")], blocks: [range("10:15", "11:15")] }),
      ),
    );
    expect(slots).not.toContain("10h00");
    expect(slots).not.toContain("10h30");
    expect(slots).not.toContain("11h00");
    expect(slots).toContain("11h30");
  });
});

describe("availableSlots: the professional's hours", () => {
  it("stays inside the professional's own hours", () => {
    const slots = times(
      availableSlots(
        input({ professionalHours: [{ weekday: 1, startTime: "10:00", endTime: "12:00" }] }),
      ),
    );
    expect(slots).toEqual(["10h00", "10h30", "11h00", "11h30"]);
  });

  it("never goes beyond the business hours, even if the professional's hours do", () => {
    const slots = times(
      availableSlots(
        input({ professionalHours: [{ weekday: 1, startTime: "08:00", endTime: "12:00" }] }),
      ),
    );
    expect(slots[0]).toBe("09h00");
  });

  it("rounds a start that is off the grid up to the grid", () => {
    const slots = times(
      availableSlots(
        input({ professionalHours: [{ weekday: 1, startTime: "09:15", endTime: "12:00" }] }),
      ),
    );
    expect(slots[0]).toBe("09h30");
  });

  it("is empty on a day the professional does not work", () => {
    expect(availableSlots(input({ date: Temporal.PlainDate.from("2026-11-01") }))).toEqual([]);
  });

  it("is empty for an inactive professional", () => {
    expect(availableSlots(input({ professionalActive: false }))).toEqual([]);
  });
});

describe("availableSlots: minimum notice and how far ahead", () => {
  const mondayAt = (time: string) => localToInstant("2026-11-02", time);

  it("skips times inside the minimum notice", () => {
    const slots = times(
      availableSlots(input({ now: mondayAt("09:10"), minNoticeMinutes: 30 })),
    );
    expect(slots[0]).toBe("10h00"); // 09h40 rounded up to the grid
  });

  it("with no notice, offers the next grid time", () => {
    const slots = times(availableSlots(input({ now: mondayAt("09:10"), minNoticeMinutes: 0 })));
    expect(slots[0]).toBe("09h30");
  });

  it("with no notice, a start exactly at 'now' on the grid is allowed", () => {
    const slots = times(availableSlots(input({ now: mondayAt("09:30"), minNoticeMinutes: 0 })));
    expect(slots[0]).toBe("09h30");
  });

  it("offers nothing beyond the booking window", () => {
    const now = localToInstant("2026-11-01", "09:00");
    const lastMonday = Temporal.PlainDate.from("2026-11-30"); // 29 days ahead
    expect(availableSlots(input({ now, date: lastMonday, maxAdvanceDays: 29 })).length).toBeGreaterThan(0);
    expect(availableSlots(input({ now, date: lastMonday, maxAdvanceDays: 28 }))).toEqual([]);
  });
});

describe("isSlotAvailable", () => {
  it("is true for a free grid time and false otherwise", () => {
    const data = input({ appointments: [appt("10:00", "10:30")] });
    expect(isSlotAvailable(data, at("09:30"))).toBe(true);
    expect(isSlotAvailable(data, at("10:00"))).toBe(false); // taken
    expect(isSlotAvailable(data, at("09:10"))).toBe(false); // off the grid
    expect(isSlotAvailable(data, at("12:30"))).toBe(false); // lunch break
  });
});

describe("findSlots", () => {
  it("merges professionals, ordered by time and then by id", () => {
    const a = input({ professionalHours: [{ weekday: 1, startTime: "09:00", endTime: "10:00" }] });
    const b = input({ professionalHours: [{ weekday: 1, startTime: "09:30", endTime: "10:30" }] });
    const result = findSlots([
      { professionalId: "pedro", input: b },
      { professionalId: "joao", input: a },
    ]);
    expect(result.map((s) => `${formatTime(s.start)} ${s.professionalId}`)).toEqual([
      "09h00 joao",
      "09h30 joao",
      "09h30 pedro",
      "10h00 pedro",
    ]);
  });
});

describe("pickProfessional", () => {
  const base = { servedCustomerBefore: false, appointmentsThatDay: 0, order: 0 };

  it("prefers who already served the customer", () => {
    expect(
      pickProfessional([
        { ...base, professionalId: "a", appointmentsThatDay: 0, order: 1 },
        { ...base, professionalId: "b", servedCustomerBefore: true, appointmentsThatDay: 5, order: 2 },
      ]),
    ).toBe("b");
  });

  it("otherwise prefers the least busy that day", () => {
    expect(
      pickProfessional([
        { ...base, professionalId: "a", appointmentsThatDay: 4, order: 1 },
        { ...base, professionalId: "b", appointmentsThatDay: 2, order: 2 },
      ]),
    ).toBe("b");
  });

  it("breaks ties by registration order, so the result is always the same", () => {
    const candidates = [
      { ...base, professionalId: "b", order: 2 },
      { ...base, professionalId: "a", order: 1 },
    ];
    expect(pickProfessional(candidates)).toBe("a");
    expect(pickProfessional([...candidates].reverse())).toBe("a");
  });

  it("returns null when nobody is free", () => {
    expect(pickProfessional([])).toBeNull();
  });
});

describe("nearestSlots", () => {
  const day2 = (time: string) => at(time, "2026-11-03");
  const slots = [at("13:00"), at("14:30"), at("15:30"), at("16:00"), at("17:00"), day2("09:00"), day2("09:30")];

  it("offers the closest times, before or after, in chronological order", () => {
    expect(times(nearestSlots(at("15:00"), slots))).toEqual(["14h30", "15h30", "16h00"]);
  });

  it("includes the next day when the requested day is nearly full", () => {
    const requested = at("17:30");
    expect(times(nearestSlots(requested, [at("17:00"), day2("09:00"), day2("09:30")]))).toEqual([
      "17h00",
      "09h00",
      "09h30",
    ]);
  });

  it("ignores other days and the requested time itself", () => {
    const farAway = at("10:00", "2026-11-09");
    expect(nearestSlots(at("15:00"), [farAway, at("15:00")])).toEqual([]);
  });

  it("breaks a tie by offering the earlier time first", () => {
    expect(times(nearestSlots(at("15:00"), [at("14:30"), at("15:30")], 1))).toEqual(["14h30"]);
  });

  it("offers three alternatives by default", () => {
    expect(ALTERNATIVES_COUNT).toBe(3);
    expect(nearestSlots(at("15:00"), slots)).toHaveLength(3);
  });
});
