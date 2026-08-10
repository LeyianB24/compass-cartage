// src/components/BrandMark.tsx

/**
 * Inline brand mark derived from the official "Compass Cartage —
 * Maritime & Highway Shield" concept (Compass-Cartage-Shield-Mark.svg
 * in /public/logos). Inlined (rather than <img src>) and rewritten to
 * use currentColor so it adapts to light/dark text contexts
 * automatically. The compass star keeps the gold accent.
 */
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 10 L82 22 V50 C82 70 50 90 50 90 C50 90 18 70 18 50 V22 L50 10 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <path d="M38 78 L47 48" stroke="currentColor" strokeWidth="2" />
      <path d="M62 78 L53 48" stroke="currentColor" strokeWidth="2" />
      <polygon
        points="50,22 54,36 68,36 56,44 60,58 50,48 40,58 44,44 32,36 46,36"
        fill="#c9a227"
      />
    </svg>
  );
}
