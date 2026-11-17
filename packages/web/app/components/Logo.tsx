type LogoMarkProps = { size?: number };

export function LogoMark({ size = 24 }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} fill="none" strokeWidth={6} aria-hidden="true">
      <path d="M21 12V52" stroke="#120b0e" />
      <path d="M21 15H30A7 7 0 0 1 30 29" stroke="#120b0e" />
      <path d="M21 29H33A10 10 0 0 1 33 49H21" stroke="#6b1d3a" />
    </svg>
  );
}

export function LogoWordmark() {
  return (
    <span className="logo-word">
      baro<span className="logo-word-x">x</span>y
    </span>
  );
}

export default function Logo({ size = 26 }: LogoMarkProps) {
  return (
    <>
      <LogoMark size={size} />
      <LogoWordmark />
    </>
  );
}
