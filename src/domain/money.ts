// Money is always an integer number of cents. Floats only exist at the edge, as text.

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function assertCents(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`Invalid amount in cents: ${value}`);
  }
}

/** 4500 -> "R$ 45,00". Exact: the decimal string is built from integers, never from a float. */
export function formatBRL(cents: number): string {
  assertCents(cents);
  const reais = Math.floor(cents / 100);
  const rest = String(cents % 100).padStart(2, "0");
  return BRL.format(`${reais}.${rest}` as `${number}`);
}

/**
 * Reads what an owner types in a price field: "45", "45,5", "R$ 45,00", "1.234,50".
 * A dot is only accepted as a thousands separator ("1.500"), so "45.50" is rejected instead of
 * guessed. Returns null for anything else, including negatives.
 */
export function parseBRLToCents(input: string): number | null {
  const text = input.replace(/ /g, " ").replace(/^R\$\s*/i, "").trim();
  const match = /^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?$/.exec(text);
  if (!match) return null;

  const reais = Number(match[1].replace(/\./g, ""));
  const cents = match[2] ? Number(match[2].padEnd(2, "0")) : 0;
  const total = reais * 100 + cents;
  return Number.isSafeInteger(total) ? total : null;
}
