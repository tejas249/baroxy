type LogoMarkProps = { size?: number };

export function LogoMark({ size = 24 }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeWidth={6} aria-hidden="true">
      <path d="M21 12V52" stroke="currentColor" />
      <path d="M21 15H30A7 7 0 0 1 30 29" stroke="currentColor" />
      <path d="M21 29H33A10 10 0 0 1 33 49H21" stroke="var(--accent)" />
    </svg>
  );
}

/* The icon's B doubles as the wordmark's first letter, so mark and name read as one. */
function BGlyph() {
  return (
    <svg className="logo-b" viewBox="18 12 28 40" fill="none" strokeWidth={6} aria-hidden="true">
      <path d="M21 12V52" stroke="currentColor" />
      <path d="M21 15H30A7 7 0 0 1 30 29" stroke="currentColor" />
      <path d="M21 29H33A10 10 0 0 1 33 49H21" stroke="var(--accent)" />
    </svg>
  );
}

export function LogoWordmark() {
  return (
    <span className="logo-word" aria-label="baroxy">
      <BGlyph />
      <span aria-hidden="true">
        aro<span className="logo-word-x">x</span>y
      </span>
    </span>
  );
}

export default function Logo() {
  return <LogoWordmark />;
}
