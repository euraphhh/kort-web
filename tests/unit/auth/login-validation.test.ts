import { describe, expect, it } from "vitest";
import { LOGIN_MESSAGES, validateLogin } from "../../../src/lib/auth/login-validation";

describe("validateLogin", () => {
  it("accepts a valid e-mail and a password, trimming the e-mail", () => {
    expect(validateLogin({ email: "  dono@barbearia.com ", password: "segredo" })).toEqual({
      ok: true,
      email: "dono@barbearia.com",
      password: "segredo",
    });
  });

  it("keeps the password exactly as typed (spaces included)", () => {
    const result = validateLogin({ email: "a@b.co", password: " com espaço " });
    expect(result.ok && result.password).toBe(" com espaço ");
  });

  it("asks for the e-mail and the password when both are empty", () => {
    expect(validateLogin({ email: "", password: "" })).toEqual({
      ok: false,
      email: "",
      errors: { email: LOGIN_MESSAGES.emailRequired, password: LOGIN_MESSAGES.passwordRequired },
    });
  });

  it.each([["   "], ["sem-arroba"], ["a@b"], ["a b@c.com"], ["@c.com"]])(
    "refuses the e-mail %j and keeps what was typed",
    (email) => {
      const result = validateLogin({ email, password: "x" });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeUndefined();
      expect(result.email).toBe(email.trim());
    },
  );

  it("refuses an invalid e-mail with a message that says what to do", () => {
    const result = validateLogin({ email: "sem-arroba", password: "x" });
    expect(!result.ok && result.errors.email).toBe(LOGIN_MESSAGES.emailInvalid);
  });

  it("treats values that are not text as empty", () => {
    const result = validateLogin({ email: null, password: undefined });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual({
        email: LOGIN_MESSAGES.emailRequired,
        password: LOGIN_MESSAGES.passwordRequired,
      });
    }
  });
});
