import type { Metadata } from "next";
import { LogoMark, LogoWordmark } from "../components/Logo";

export const metadata: Metadata = {
  title: "Brand",
  description: "The Baroxy logo: lockup, mark, colour and usage.",
  robots: { index: false },
};

const swatches = [
  { name: "Ink", hex: "#120b0e" },
  { name: "Garnet", hex: "#6b1d3a" },
  { name: "Rose clay", hex: "#e0a085" },
  { name: "Bone", hex: "#f3ece2" },
];

export default function BrandPage() {
  return (
    <main className="shell shell--wide">
      <header className="tool-header">
        <p className="kicker">Brand</p>
        <h1>The Baroxy logo.</h1>
        <p className="sub">
          One lockup: the icon&rsquo;s B is the first letter of the name. No separate badge, no
          mismatched type.
        </p>
      </header>

      <div className="brand-grid">
        <section className="brand-card brand-card--light brand-card--wide">
          <span className="brand-label">Primary lockup</span>
          <div className="brand-stage" style={{ fontSize: "5rem" }}>
            <LogoWordmark />
          </div>
        </section>

        <section className="brand-card brand-card--dark brand-card--wide">
          <span className="brand-label">On dark</span>
          <div className="brand-stage" style={{ fontSize: "5rem" }}>
            <LogoWordmark />
          </div>
        </section>

        <section className="brand-card brand-card--light">
          <span className="brand-label">Mark</span>
          <div className="brand-stage">
            <LogoMark size={96} />
          </div>
        </section>

        <section className="brand-card brand-card--dark">
          <span className="brand-label">App tile</span>
          <div className="brand-stage">
            <span className="brand-tile">
              <LogoMark size={64} />
            </span>
          </div>
        </section>

        <section className="brand-card brand-card--light">
          <span className="brand-label">Small sizes</span>
          <div className="brand-stage brand-stage--row">
            {[3.2, 2.2, 1.5, 1.1].map((s) => (
              <span key={s} style={{ fontSize: `${s}rem` }}>
                <LogoWordmark />
              </span>
            ))}
          </div>
        </section>

        <section className="brand-card brand-card--light">
          <span className="brand-label">Colour</span>
          <div className="brand-swatches">
            {swatches.map((s) => (
              <div key={s.hex}>
                <span className="brand-swatch" style={{ background: s.hex }} />
                <strong>{s.name}</strong>
                <code>{s.hex}</code>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
