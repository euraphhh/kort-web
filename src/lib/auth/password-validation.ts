// Rule for a new password, shared by "reset password" and (later) "accept invite".
// Decided 20/oct/2026: at least 8 characters with upper and lower case letters, a number and a
// symbol. It mirrors Supabase's `lower_upper_letters_digits_symbols` setting, which is the real
// enforcement; this gives the message before the round trip.
// Messages say what to do, never just "invalid".

export type PasswordErrors = { password?: string; confirmation?: string };

export type PasswordValidation = { ok: true; password: string } | { ok: false; errors: PasswordErrors };

export const MIN_PASSWORD_LENGTH = 8;

export const PASSWORD_MESSAGES = {
  required: "Crie uma senha.",
  tooShort: `Use pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
  confirmationRequired: "Repita a senha.",
  mismatch: "As senhas não são iguais. Digite a mesma nos dois campos.",
} as const;

/** Each rule of a new password, in the order the screen lists them. `kind` is the word used in "Falta ...". */
const REQUIREMENTS = [
  { id: "length", label: `Pelo menos ${MIN_PASSWORD_LENGTH} caracteres`, kind: null, test: (p: string) => p.length >= MIN_PASSWORD_LENGTH },
  { id: "upper", label: "Uma letra maiúscula", kind: "letra maiúscula", test: (p: string) => /\p{Lu}/u.test(p) },
  { id: "lower", label: "Uma letra minúscula", kind: "letra minúscula", test: (p: string) => /\p{Ll}/u.test(p) },
  { id: "number", label: "Um número", kind: "número", test: (p: string) => /\p{N}/u.test(p) },
  { id: "symbol", label: "Um símbolo, como ! ou @", kind: "símbolo", test: (p: string) => /[^\p{L}\p{N}]/u.test(p) },
] as const;

export type PasswordCheck = { id: string; label: string; met: boolean };

/** For the checklist on the screen: every requirement and whether the password already meets it. */
export function checkPassword(password: string): PasswordCheck[] {
  return REQUIREMENTS.map(({ id, label, test }) => ({ id, label, met: test(password) }));
}

function missingKinds(password: string): string[] {
  return REQUIREMENTS.filter((rule) => rule.kind && !rule.test(password)).map((rule) => rule.kind as string);
}

function join(items: string[]): string {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} e ${items.at(-1)}` : items[0];
}

export function validateNewPassword(input: { password: unknown; confirmation: unknown }): PasswordValidation {
  const password = typeof input.password === "string" ? input.password : "";
  const confirmation = typeof input.confirmation === "string" ? input.confirmation : "";
  const errors: PasswordErrors = {};

  if (!password) {
    errors.password = PASSWORD_MESSAGES.required;
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = PASSWORD_MESSAGES.tooShort;
  } else {
    const missing = missingKinds(password);
    if (missing.length > 0) errors.password = `Falta ${join(missing)}.`;
  }

  if (!confirmation) errors.confirmation = PASSWORD_MESSAGES.confirmationRequired;
  else if (!errors.password && confirmation !== password) errors.confirmation = PASSWORD_MESSAGES.mismatch;

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, password };
}
