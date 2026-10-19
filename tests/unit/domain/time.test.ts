import { Temporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";
import {
  SLOT_MINUTES,
  TIME_ZONE,
  addMinutes,
  formatDate,
  formatTime,
  instantFromDate,
  isOnSlotGrid,
  localDate,
  localToInstant,
  parseInstant,
  weekdayIndex,
} from "../../../src/domain/time";

describe("time zone", () => {
  it("uses America/Sao_Paulo and a 30 minute grid", () => {
    expect(TIME_ZONE).toBe("America/Sao_Paulo");
    expect(SLOT_MINUTES).toBe(30);
  });
});

describe("localToInstant", () => {
  it("converts local wall-clock time to UTC", () => {
    expect(localToInstant("2026-11-02", "09:30").toString()).toBe("2026-11-02T12:30:00Z");
    expect(localToInstant("2026-11-02", "00:00").toString()).toBe("2026-11-02T03:00:00Z");
  });

  it("refuses a local time that never existed (DST start in 2018)", () => {
    expect(() => localToInstant("2018-11-04", "00:30")).toThrow(RangeError);
  });
});

describe("parseInstant and instantFromDate", () => {
  it("parses an ISO instant with Z or an offset", () => {
    expect(parseInstant("2026-11-02T12:30:00Z").toString()).toBe("2026-11-02T12:30:00Z");
    expect(parseInstant("2026-11-02T09:30:00-03:00").toString()).toBe("2026-11-02T12:30:00Z");
  });

  it("refuses an ISO string without an offset (it would be ambiguous)", () => {
    expect(() => parseInstant("2026-11-02T09:30:00")).toThrow();
  });

  it("converts a JS Date", () => {
    expect(instantFromDate(new Date("2026-11-02T12:30:00Z")).toString()).toBe("2026-11-02T12:30:00Z");
  });
});

describe("formatTime", () => {
  it.each([
    ["2026-11-02T12:30:00Z", "09h30"],
    ["2026-11-02T12:00:00Z", "09h00"],
    ["2026-11-02T03:05:00Z", "00h05"],
    ["2026-11-02T21:45:00Z", "18h45"],
  ])("formats %s as %s", (iso, expected) => {
    expect(formatTime(parseInstant(iso))).toBe(expected);
  });
});

describe("formatDate", () => {
  it("formats as weekday, dd/mm in local time", () => {
    expect(formatDate(parseInstant("2026-11-02T12:00:00Z"))).toBe("segunda, 02/11");
    expect(formatDate(parseInstant("2026-11-01T15:00:00Z"))).toBe("domingo, 01/11");
  });

  it("uses the local day, not the UTC day", () => {
    // 02:30 UTC on the 3rd is still 23h30 on the 2nd in São Paulo.
    expect(formatDate(parseInstant("2026-11-03T02:30:00Z"))).toBe("segunda, 02/11");
  });
});

describe("localDate and weekdayIndex", () => {
  it("returns the local calendar date", () => {
    expect(localDate(parseInstant("2026-11-03T02:30:00Z")).toString()).toBe("2026-11-02");
  });

  it("numbers weekdays like the database: 0 = Sunday ... 6 = Saturday", () => {
    expect(weekdayIndex(Temporal.PlainDate.from("2026-11-01"))).toBe(0);
    expect(weekdayIndex(Temporal.PlainDate.from("2026-11-02"))).toBe(1);
    expect(weekdayIndex(Temporal.PlainDate.from("2026-11-07"))).toBe(6);
  });
});

describe("addMinutes", () => {
  it("adds minutes to an instant", () => {
    expect(addMinutes(parseInstant("2026-11-02T12:30:00Z"), 45).toString()).toBe("2026-11-02T13:15:00Z");
  });
});

describe("isOnSlotGrid", () => {
  it.each([
    ["2026-11-02T12:00:00Z", true],
    ["2026-11-02T12:30:00Z", true],
    ["2026-11-02T12:15:00Z", false],
    ["2026-11-02T12:45:00Z", false],
    ["2026-11-02T12:30:10Z", false],
  ])("%s on the grid: %s", (iso, expected) => {
    expect(isOnSlotGrid(parseInstant(iso))).toBe(expected);
  });
});
