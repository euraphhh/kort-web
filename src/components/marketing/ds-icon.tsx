// Ícones desenhados do design system kort (design/components/bundle.js):
// 16px, traço 1,8px, pontas arredondadas, currentColor.

const paths = {
  check: <path d="M3.5 8.5l3 3L12.5 5" />,
  clock: (
    <>
      <circle cx={8} cy={8} r={6} />
      <path d="M8 5.2V8l2 1.3" />
    </>
  ),
  x: <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />,
  dot: <circle cx={8} cy={8} r={2.6} fill="currentColor" stroke="none" />,
  ban: (
    <>
      <circle cx={8} cy={8} r={6} />
      <path d="M3.8 12.2l8.4-8.4" />
    </>
  ),
} as const;

export type DsIconName = keyof typeof paths;

export function DsIcon({ name }: { name: DsIconName }) {
  return (
    <svg
      className="size-icon-ui flex-none"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
