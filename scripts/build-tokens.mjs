// Gera src/styles/tokens.css e src/lib/motion-tokens.ts a partir de
// design/tokens.json (design system kort) e design/tokens.landing.json
// (extensão da landing). Resolve os aliases {token} por tema.
// Uso: node scripts/build-tokens.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const ds = read("design/tokens.json");
const ext = read("design/tokens.landing.json");
const THEMES = ds.color.themes.map((t) => t.id); // ["light", "dark"]
const [LIGHT, DARK] = THEMES;

const list = (group) => group?.tokens ?? [];
const colorTokens = [...list(ds.color), ...list(ext.color)];
const shadowTokens = [...list(ds.shadow), ...list(ext.shadow)];
const spaceTokens = [...list(ds.spacing), ...list(ext.spacing)];
const radiusTokens = [...list(ds.radius), ...list(ext.radius)];
const sizeTokens = [...list(ds.size), ...list(ext.size)];
const breakpointTokens = list(ext.breakpoint);
const motionTokens = list(ext.motion);
const typeStyles = [...ds.type.groups, ...(ext.type?.groups ?? [])].flatMap((g) => g.styles);

const byName = new Map(colorTokens.map((t) => [t.name, t]));
const isThemed = (v) => typeof v === "object" && v !== null;

function resolve(name, theme, seen = new Set()) {
  if (seen.has(name)) throw new Error(`Alias circular: ${[...seen, name].join(" -> ")}`);
  const token = byName.get(name);
  if (!token) throw new Error(`Token não encontrado: ${name}`);
  seen.add(name);
  const raw = isThemed(token.value) ? token.value[theme] : token.value;
  const alias = /^\{(.+)\}$/.exec(raw);
  return alias ? resolve(alias[1], theme, seen) : raw;
}

// Um token é "de tema" se o valor, ou algum alias no caminho, muda por tema.
const varies = (name) => resolve(name, LIGHT) !== resolve(name, DARK);

const decl = (name, value) => `  --${name}: ${value};`;
const themeValue = (v, theme) => (isThemed(v) ? v[theme] : v);

// ---------- variáveis cruas, com os nomes do kort ----------
const fixed = [];
const light = [];
const dark = [];

for (const t of colorTokens) {
  if (varies(t.name)) {
    light.push(decl(t.name, resolve(t.name, LIGHT)));
    dark.push(decl(t.name, resolve(t.name, DARK)));
  } else {
    fixed.push(decl(t.name, resolve(t.name, LIGHT)));
  }
}
for (const t of shadowTokens) {
  light.push(decl(t.name, themeValue(t.value, LIGHT)));
  dark.push(decl(t.name, themeValue(t.value, DARK)));
}
for (const t of [...spaceTokens, ...sizeTokens]) fixed.push(decl(t.name, t.value));
for (const t of motionTokens) fixed.push(decl(t.name, t.value));

fixed.push(decl("font-family-sans", ds.type.families.sans));
if (ext.type?.families?.serif) fixed.push(decl("font-family-serif", ext.type.families.serif));
for (const s of typeStyles) {
  fixed.push(decl(`type-${s.name}-font-size`, s.fontSize));
  fixed.push(decl(`type-${s.name}-line-height`, s.lineHeight));
  fixed.push(decl(`type-${s.name}-font-weight`, String(s.fontWeight)));
  if (s.letterSpacing) fixed.push(decl(`type-${s.name}-letter-spacing`, s.letterSpacing));
}

// ---------- Tailwind v4 ----------
// @theme (sem inline): namespaces cujo nome já é o do kort (radius, ease, breakpoint).
const themeStatic = [
  "  --radius-*: initial;",
  ...radiusTokens.map((t) => decl(t.name, t.value)),
  "  --shadow-*: initial;",
  "  --ease-*: initial;",
  ...motionTokens.filter((t) => t.name.startsWith("ease-")).map((t) => decl(t.name, t.value)),
  "  --breakpoint-*: initial;",
  ...breakpointTokens.map((t) => decl(`breakpoint-${t.name}`, t.value)),
];

// @theme inline: liga as variáveis do kort aos namespaces do Tailwind.
const themeInline = [
  "  --color-*: initial;",
  ...colorTokens.map((t) => decl(`color-${t.name}`, `var(--${t.name})`)),
  ...spaceTokens.map((t) => decl(`spacing-${t.name.replace(/^space-/, "")}`, `var(--${t.name})`)),
  ...sizeTokens.map((t) => decl(`spacing-${t.name}`, `var(--${t.name})`)),
  "  --container-*: initial;",
  ...sizeTokens
    .filter((t) => t.name === "container" || t.name === "prose")
    .map((t) => decl(`container-${t.name}`, `var(--${t.name})`)),
  decl("font-sans", "var(--font-manrope), var(--font-family-sans)"),
  ...(ext.type?.families?.serif ? [decl("font-serif", "var(--font-instrument-serif), var(--font-family-serif)")] : []),
  "  --text-*: initial;",
  ...typeStyles.flatMap((s) => [
    decl(`text-${s.name}`, `var(--type-${s.name}-font-size)`),
    decl(`text-${s.name}--line-height`, `var(--type-${s.name}-line-height)`),
    decl(`text-${s.name}--font-weight`, `var(--type-${s.name}-font-weight)`),
    ...(s.letterSpacing ? [decl(`text-${s.name}--letter-spacing`, `var(--type-${s.name}-letter-spacing)`)] : []),
  ]),
];

const header = `/* GERADO por scripts/build-tokens.mjs a partir de design/tokens.json e
   design/tokens.landing.json. Não edite à mão: rode \`npm run tokens\`. */`;

const css = `${header}

@theme {
${themeStatic.join("\n")}
}

@theme inline {
${themeInline.join("\n")}
}

/* Sombras mudam por tema: utilitário próprio para o Tailwind não embutir o valor claro. */
${shadowTokens.map((t) => `@utility ${t.name} {\n  box-shadow: var(--${t.name});\n}`).join("\n")}

:root {
  color-scheme: ${LIGHT};
${fixed.join("\n")}
${light.join("\n")}
}

/* Sem JS (next-themes ainda não marcou o <html>): segue o sistema. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="${LIGHT}"]) {
    color-scheme: ${DARK};
${dark.map((l) => "  " + l).join("\n")}
  }
}

[data-theme="${DARK}"] {
  color-scheme: ${DARK};
${dark.join("\n")}
}
`;

// ---------- movimento para o Motion (segundos, arrays de bezier, números) ----------
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function motionValue(v) {
  const ms = /^([\d.]+)ms$/.exec(v);
  if (ms) return Number(ms[1]) / 1000;
  const px = /^([\d.]+)px$/.exec(v);
  if (px) return Number(px[1]);
  const bezier = /^cubic-bezier\(([^)]+)\)$/.exec(v);
  if (bezier) return bezier[1].split(",").map((n) => Number(n.trim()));
  if (/^[\d.]+$/.test(v)) return Number(v);
  throw new Error(`Valor de movimento não suportado: ${v}`);
}
const motionTs = `// GERADO por scripts/build-tokens.mjs a partir de design/tokens.landing.json.
// Não edite à mão: rode \`npm run tokens\`. Durações em segundos, distâncias em px.

export const motionTokens = {
${motionTokens.map((t) => `  ${camel(t.name)}: ${JSON.stringify(motionValue(t.value))},`).join("\n")}
} as const;
`;

const write = (p, content) => {
  mkdirSync(dirname(join(root, p)), { recursive: true });
  writeFileSync(join(root, p), content);
  console.log(`tokens: ${p}`);
};
write("src/styles/tokens.css", css);
write("src/lib/motion-tokens.ts", motionTs);
