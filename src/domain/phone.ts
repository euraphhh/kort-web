// Phone numbers are stored in E.164 (+5511999990001). The database only checks the format;
// everything that turns what a person typed into that format lives here.

export type PhoneKind = "mobile" | "landline" | "unknown";

export type PhoneResult =
  | { ok: true; e164: string; kind: PhoneKind }
  | { ok: false; reason: "empty" | "invalid" | "missing_ddd" };

const DDD = /^[1-9][1-9]$/;

/**
 * Normalizes a phone typed or imported in any common Brazilian format: with or without +55,
 * with or without the ninth digit, with parentheses, spaces and dashes, with a leading 0.
 * `defaultDdd` fills in numbers that came without an area code (barbershop setting).
 * Numbers with another country code are accepted when they look like E.164.
 */
export function normalizePhone(input: string, defaultDdd?: string): PhoneResult {
  const raw = input.trim();
  if (!raw) return { ok: false, reason: "empty" };

  const explicitCountry = raw.startsWith("+") || raw.startsWith("00");
  let digits = raw.replace(/\D/g, "");
  if (raw.startsWith("00")) digits = digits.slice(2);

  if (explicitCountry && !digits.startsWith("55")) {
    return /^[1-9]\d{7,14}$/.test(digits)
      ? { ok: true, e164: `+${digits}`, kind: "unknown" }
      : { ok: false, reason: "invalid" };
  }

  // Trunk prefix ("011 99999-0001") and country code ("55...").
  digits = digits.replace(/^0+/, "");
  let national = digits;
  if (digits.startsWith("55") && (explicitCountry || digits.length === 12 || digits.length === 13)) {
    national = digits.slice(2);
  }

  let ddd: string;
  let number: string;
  if (national.length === 10 || national.length === 11) {
    ddd = national.slice(0, 2);
    number = national.slice(2);
  } else if (national.length === 8 || national.length === 9) {
    if (explicitCountry) return { ok: false, reason: "invalid" };
    if (!defaultDdd || !DDD.test(defaultDdd)) return { ok: false, reason: "missing_ddd" };
    ddd = defaultDdd;
    number = national;
  } else {
    return { ok: false, reason: "invalid" };
  }

  if (!DDD.test(ddd)) return { ok: false, reason: "invalid" };

  let kind: PhoneKind;
  if (number.length === 9) {
    if (number[0] !== "9") return { ok: false, reason: "invalid" };
    kind = "mobile";
  } else if (/^[6-9]/.test(number)) {
    // Old mobile numbers without the ninth digit.
    number = `9${number}`;
    kind = "mobile";
  } else if (/^[2-5]/.test(number)) {
    kind = "landline";
  } else {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, e164: `+55${ddd}${number}`, kind };
}
