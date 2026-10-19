import { describe, expect, it } from "vitest";
import { validateForgotPassword } from "../../../src/lib/auth/forgot-password-validation";
import { LOGIN_MESSAGES } from "../../../src/lib/auth/login-validation";

describe("validateForgotPassword", () => {
  it("accepts a valid e-mail and trims it", () => {
    expect(validateForgotPassword({ email: "  a@b.com " })).toEqual({ ok: true, email: "a@b.com" });
  });
  it("asks for the e-mail when empty or not a string", () => {
    expect(validateForgotPassword({ email: "" })).toMatchObject({ ok: false, error: LOGIN_MESSAGES.emailRequired });
    expect(validateForgotPassword({ email: null })).toMatchObject({ ok: false, error: LOGIN_MESSAGES.emailRequired });
  });
  it("rejects a malformed e-mail", () => {
    expect(validateForgotPassword({ email: "abc" })).toMatchObject({ ok: false, error: LOGIN_MESSAGES.emailInvalid });
  });
});
