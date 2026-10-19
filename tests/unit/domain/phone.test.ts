import { describe, expect, it } from "vitest";
import { normalizePhone } from "../../../src/domain/phone";

const MOBILE = "+5511999990001";

describe("normalizePhone: Brazilian mobile in any format", () => {
  it.each([
    ["11999990001"],
    ["11 99999-0001"],
    ["(11) 99999-0001"],
    ["(11)99999.0001"],
    ["5511999990001"],
    ["+5511999990001"],
    ["+55 (11) 99999-0001"],
    ["55 11 99999 0001"],
    ["011 99999-0001"],
    ["0055 11 99999-0001"],
    ["tel: (11) 99999-0001"],
  ])("normalizes %j", (input) => {
    expect(normalizePhone(input)).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
  });

  it("adds the ninth digit to old mobile numbers", () => {
    expect(normalizePhone("11 9999-0001")).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
    expect(normalizePhone("+55 (11) 9999-0001")).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
    expect(normalizePhone("551199990001")).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
  });

  it("gives every format of the same number the same result", () => {
    const formats = ["11999990001", "(11) 99999-0001", "+55 11 99999-0001", "11 9999-0001", "5511999990001"];
    const results = formats.map((f) => normalizePhone(f));
    expect(new Set(results.map((r) => (r.ok ? r.e164 : "fail"))).size).toBe(1);
  });
});

describe("normalizePhone: area code 55 (Rio Grande do Sul)", () => {
  it("does not mistake the area code for the country code", () => {
    expect(normalizePhone("55 99999-0001")).toEqual({ ok: true, e164: "+5555999990001", kind: "mobile" });
    expect(normalizePhone("5555999990001")).toEqual({ ok: true, e164: "+5555999990001", kind: "mobile" });
  });
});

describe("normalizePhone: landline", () => {
  it("keeps landlines and flags them", () => {
    expect(normalizePhone("(11) 3333-4444")).toEqual({ ok: true, e164: "+551133334444", kind: "landline" });
  });
});

describe("normalizePhone: default area code", () => {
  it("fills in numbers that came without an area code", () => {
    expect(normalizePhone("99999-0001", "11")).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
    expect(normalizePhone("9999-0001", "11")).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
    expect(normalizePhone("999990001", "11")).toEqual({ ok: true, e164: MOBILE, kind: "mobile" });
  });

  it("asks for the area code when there is none to use", () => {
    expect(normalizePhone("99999-0001")).toEqual({ ok: false, reason: "missing_ddd" });
    expect(normalizePhone("99999-0001", "1")).toEqual({ ok: false, reason: "missing_ddd" });
    expect(normalizePhone("99999-0001", "abc")).toEqual({ ok: false, reason: "missing_ddd" });
  });

  it("does not apply the default to a number that already has +55 but no area code", () => {
    expect(normalizePhone("+55 99999-0001", "11")).toEqual({ ok: false, reason: "invalid" });
  });

  it("ignores the default when the number has its own area code", () => {
    expect(normalizePhone("(21) 99999-0001", "11")).toEqual({ ok: true, e164: "+5521999990001", kind: "mobile" });
  });
});

describe("normalizePhone: other countries", () => {
  it("accepts international numbers that look like E.164", () => {
    expect(normalizePhone("+1 (415) 555-2671")).toEqual({ ok: true, e164: "+14155552671", kind: "unknown" });
    expect(normalizePhone("00351 912 345 678")).toEqual({ ok: true, e164: "+351912345678", kind: "unknown" });
  });

  it("rejects international numbers that are too short or too long", () => {
    expect(normalizePhone("+1 234")).toEqual({ ok: false, reason: "invalid" });
    expect(normalizePhone("+1234567890123456")).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("normalizePhone: invalid input", () => {
  it("rejects empty input", () => {
    expect(normalizePhone("")).toEqual({ ok: false, reason: "empty" });
    expect(normalizePhone("   ")).toEqual({ ok: false, reason: "empty" });
  });

  it.each([
    ["abc"],
    ["123"],
    ["(10) 99999-0001"], // 10 is not an area code
    ["(11) 89999-0001"], // 9-digit mobile must start with 9
    ["(11) 1999-0001"], // 8-digit number cannot start with 1
    ["11 99999-00012"], // too long
    ["---"],
  ])("rejects %j", (input) => {
    const result = normalizePhone(input, "11");
    expect(result.ok).toBe(false);
  });
});
