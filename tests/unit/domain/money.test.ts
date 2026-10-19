import { describe, expect, it } from "vitest";
import { assertCents, formatBRL, parseBRLToCents } from "../../../src/domain/money";

// Intl puts a no-break space between "R$" and the number.
const plain = (text: string) => text.replace(/ /g, " ");

describe("formatBRL", () => {
  it.each([
    [0, "R$ 0,00"],
    [99, "R$ 0,99"],
    [4500, "R$ 45,00"],
    [4550, "R$ 45,50"],
    [123456, "R$ 1.234,56"],
    [100000000, "R$ 1.000.000,00"],
  ])("formats %i cents as %s", (cents, expected) => {
    expect(plain(formatBRL(cents))).toBe(expected);
  });

  it("refuses amounts that are not non-negative integers", () => {
    expect(() => formatBRL(-1)).toThrow(RangeError);
    expect(() => formatBRL(45.5)).toThrow(RangeError);
    expect(() => formatBRL(Number.NaN)).toThrow(RangeError);
  });
});

describe("assertCents", () => {
  it("accepts zero and positive integers", () => {
    expect(() => assertCents(0)).not.toThrow();
    expect(() => assertCents(4500)).not.toThrow();
  });
});

describe("parseBRLToCents", () => {
  it.each([
    ["45", 4500],
    ["45,00", 4500],
    ["45,5", 4550],
    ["45,05", 4505],
    ["0", 0],
    ["R$ 45,00", 4500],
    ["R$45", 4500],
    ["R$ 45,00", 4500],
    ["1.234,50", 123450],
    ["1.500", 150000],
    ["  45  ", 4500],
  ])("reads %j as %i cents", (text, expected) => {
    expect(parseBRLToCents(text)).toBe(expected);
  });

  it.each([
    [""],
    ["abc"],
    ["-5"],
    ["45.50"],
    ["45,555"],
    ["4,5,0"],
    ["R$"],
    ["99999999999999999999"],
  ])("rejects %j", (text) => {
    expect(parseBRLToCents(text)).toBeNull();
  });
});
