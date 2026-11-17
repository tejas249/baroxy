import type { ReactNode } from "react";

const RED = "#d6392f";

function Frame({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <svg className="illus" viewBox={wide ? "0 0 640 130" : "0 0 320 130"} role="img" aria-hidden="true">
      {children}
    </svg>
  );
}

export function FontIllus() {
  return (
    <Frame>
      <g fill="#8a7d80" fontWeight="600" fontSize="50">
        <text x="20" y="78" fontFamily="Inter, system-ui, sans-serif">
          Aa
        </text>
        <text x="115" y="78" fontFamily="Roboto, Arial, sans-serif">
          Aa
        </text>
        <text x="212" y="78" fontFamily="Poppins, Helvetica, sans-serif">
          Aa
        </text>
      </g>
      <g fill="#8a7d80" fontFamily="ui-monospace, monospace" fontSize="11">
        <text x="22" y="106">
          Inter
        </text>
        <text x="117" y="106">
          Roboto
        </text>
        <text x="214" y="106">
          Poppins
        </text>
      </g>
      <path d="M14 96 L306 30" stroke={RED} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    </Frame>
  );
}

export function GradientIllus() {
  return (
    <Frame>
      <defs>
        <linearGradient id="ill-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="20" y="16" width="280" height="98" rx="16" fill="url(#ill-grad)" />
      <circle cx="90" cy="46" r="34" fill="#fff" opacity="0.18" />
      <circle cx="240" cy="92" r="42" fill="#fff" opacity="0.12" />
      <rect x="110" y="52" width="100" height="10" rx="5" fill="#fff" opacity="0.85" />
      <rect x="130" y="70" width="60" height="7" rx="3.5" fill="#fff" opacity="0.55" />
      <circle cx="46" cy="32" r="16" fill="#fff" stroke={RED} strokeWidth="3" />
      <path d="M36 42 L56 22" stroke={RED} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  );
}

export function RadiusIllus() {
  const xs = [22, 98, 174, 250];
  return (
    <Frame>
      {xs.map((x) => (
        <g key={x}>
          <rect x={x} y="22" width="48" height="60" rx="12" fill="#fbf8f3" stroke="#d6c9ba" strokeWidth="1.5" />
          <text x={x + 24} y="106" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="11" fill="#8a7d80">
            12px
          </text>
        </g>
      ))}
      <path d="M14 14 L306 90" stroke={RED} strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    </Frame>
  );
}

export function ShadcnIllus() {
  return (
    <Frame>
      <rect x="62" y="12" width="196" height="108" rx="12" fill="#fff" stroke="#e4e4e7" strokeWidth="1.5" />
      <rect x="80" y="28" width="86" height="9" rx="4.5" fill="#d4d4d8" />
      <rect x="80" y="46" width="150" height="6" rx="3" fill="#e4e4e7" />
      <rect x="80" y="58" width="124" height="6" rx="3" fill="#e4e4e7" />
      <rect x="80" y="82" width="64" height="24" rx="8" fill="#18181b" />
      <rect x="154" y="82" width="64" height="24" rx="8" fill="#fff" stroke="#e4e4e7" />
      <rect x="54" y="4" width="212" height="124" rx="16" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="5 5" opacity="0.8" />
    </Frame>
  );
}

export function CopyIllus() {
  return (
    <Frame>
      <rect x="18" y="20" width="236" height="36" rx="18" fill="#fbe9e6" stroke="#f0bdb6" />
      <text x="36" y="43" fontFamily="system-ui, sans-serif" fontSize="14" fill="#a23a31" textDecoration="line-through">
        Unlock the power of
      </text>
      <rect x="66" y="72" width="236" height="36" rx="18" fill="#fbe9e6" stroke="#f0bdb6" />
      <text x="84" y="95" fontFamily="system-ui, sans-serif" fontSize="14" fill="#a23a31" textDecoration="line-through">
        Supercharge your workflow
      </text>
    </Frame>
  );
}

export function ColumnIllus() {
  return (
    <Frame wide>
      <defs>
        <radialGradient id="ill-blob" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="320" cy="62" r="70" fill="url(#ill-blob)" />
      <rect x="262" y="18" width="116" height="12" rx="6" fill="#8a7d80" opacity="0.7" />
      <rect x="244" y="38" width="152" height="8" rx="4" fill="#b9aeb0" opacity="0.7" />
      {[198, 272, 346].map((x) => (
        <rect key={x} x={x} y="66" width="66" height="50" rx="12" fill="#fff" stroke="#e4e4e7" strokeWidth="1.5" />
      ))}
      <path d="M320 6 V124" stroke={RED} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.7" />
      <g fontFamily="ui-monospace, monospace" fontSize="11" fill="#8a7d80">
        <text x="40" y="40">
          centered
        </text>
        <text x="40" y="62">
          gradient blob
        </text>
        <text x="40" y="84">
          3 identical cards
        </text>
        <text x="500" y="62">
          every section
        </text>
      </g>
      <path d="M12 118 L628 14" stroke={RED} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </Frame>
  );
}
