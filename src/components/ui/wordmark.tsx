/** Official wordmark (public/brand/kort-wordmark.svg), drawn with currentColor so it follows the theme. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 120" role="img" aria-label="kort" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 14V100" />
        <path d="M16 78L50 46" />
        <path d="M30 65L52 100" />
        <path d="M78.2 91.8A28 28 0 1 1 90 98.8" />
        <path d="M78.2 91.8L76 106L90 98.8" />
        <path d="M150 100V72Q150 44 176 44H214" />
        <path d="M196 16V82Q196 100 214 100" />
      </g>
    </svg>
  );
}
