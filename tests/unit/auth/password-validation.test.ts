import { describe, expect, it } from "vitest";
import { checkPassword, PASSWORD_MESSAGES, validateNewPassword } from "../../../src/lib/auth/password-validation";

const GOOD = "Barber@2026";

describe("validateNewPassword", () => {
  it("accepts a strong password that matches its confirmation", () => {
    expect(validateNewPassword({ password: GOOD, confirmation: GOOD })).toEqual({ ok: true, password: GOOD });
  });

  it("asks for the password and the confirmation when empty or not a string", () => {
    const result = validateNewPassword({ password: "", confirmation: null });
    expect(result).toMatchObject({ ok: false, errors: { password: PASSWORD_MESSAGES.required } });
  });

  it("asks for at least 8 characters", () => {
    const result = validateNewPassword({ password: "Ab1@xyz", confirmation: "Ab1@xyz" });
    expect(result).toMatchObject({ ok: false, errors: { password: PASSWORD_MESSAGES.tooShort } });
  });

  it("names what is missing: upper case, lower case, number and symbol", () => {
    const cases: Array<[string, string]> = [
      ["barber@2026", "maiúscula"],
      ["BARBER@2026", "minúscula"],
      ["Barber@abcd", "número"],
      ["Barber2026x", "símbolo"],
    ];
    for (const [password, missing] of cases) {
      const result = validateNewPassword({ password, confirmation: password });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.password).toContain(missing);
    }
  });

  it("lists every missing kind in one sentence", () => {
    const result = validateNewPassword({ password: "abcdefgh", confirmation: "abcdefgh" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.password).toContain("maiúscula");
      expect(result.errors.password).toContain("número");
      expect(result.errors.password).toContain("símbolo");
      expect(result.errors.password).not.toContain("minúscula");
    }
  });

  it("asks to repeat the password when the confirmation differs or is empty", () => {
    expect(validateNewPassword({ password: GOOD, confirmation: "Outra@2026" })).toMatchObject({
      ok: false,
      errors: { confirmation: PASSWORD_MESSAGES.mismatch },
    });
    expect(validateNewPassword({ password: GOOD, confirmation: "" })).toMatchObject({
      ok: false,
      errors: { confirmation: PASSWORD_MESSAGES.confirmationRequired },
    });
  });

  it("does not trim: spaces are part of the password", () => {
    expect(validateNewPassword({ password: " Barber@2026 ", confirmation: " Barber@2026 " })).toEqual({
      ok: true,
      password: " Barber@2026 ",
    });
  });
});

describe("checkPassword", () => {
  const met = (password: string) => Object.fromEntries(checkPassword(password).map((c) => [c.id, c.met]));

  it("lists the five requirements in order, all unmet for an empty password", () => {
    const checks = checkPassword("");
    expect(checks.map((c) => c.id)).toEqual(["length", "upper", "lower", "number", "symbol"]);
    expect(checks.every((c) => !c.met)).toBe(true);
  });

  it("marks each requirement on its own", () => {
    expect(met("abc")).toEqual({ length: false, upper: false, lower: true, number: false, symbol: false });
    expect(met("ABCDEFGH")).toEqual({ length: true, upper: true, lower: false, number: false, symbol: false });
    expect(met("Abcdefg1")).toEqual({ length: true, upper: true, lower: true, number: true, symbol: false });
  });

  it("meets all of them for a valid password, in agreement with validateNewPassword", () => {
    expect(checkPassword(GOOD).every((c) => c.met)).toBe(true);
    expect(validateNewPassword({ password: GOOD, confirmation: GOOD }).ok).toBe(true);
  });

  it("has labels that say what to do", () => {
    expect(checkPassword("").map((c) => c.label)).toEqual([
      "Pelo menos 8 caracteres",
      "Uma letra maiúscula",
      "Uma letra minúscula",
      "Um número",
      "Um símbolo, como ! ou @",
    ]);
  });
});
