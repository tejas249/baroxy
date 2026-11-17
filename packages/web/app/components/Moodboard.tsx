type Card = {
  name: string;
  tag: string;
  bg: string;
  fg: string;
  pal: [string, string, string, string];
  h: number;
};

const COLUMNS: Card[][] = [
  [
    { name: "Meridian", tag: "Clean startup", bg: "#f3ece2", fg: "#120b0e", pal: ["#6b1d3a", "#e0a085", "#1f8a4c", "#17171a"], h: 210 },
    { name: "Obsidian", tag: "Fintech", bg: "#14171f", fg: "#e8e4d8", pal: ["#c9a24d", "#2d3445", "#e8e4d8", "#0b0d12"], h: 150 },
    { name: "Petal", tag: "Beauty", bg: "#fbe3e6", fg: "#4a1a2b", pal: ["#c4456a", "#f5a7b5", "#7a2e44", "#fff5f6"], h: 190 },
  ],
  [
    { name: "Halcyon", tag: "Wellness", bg: "#dfeee6", fg: "#16342a", pal: ["#2f6b57", "#a8d5ba", "#f2c9a0", "#1c2b25"], h: 150 },
    { name: "Saffron Co.", tag: "Food & drink", bg: "#fde9c8", fg: "#3c2415", pal: ["#d9541e", "#f2a93b", "#3c2415", "#fff7e6"], h: 230 },
    { name: "Quarry", tag: "Architecture", bg: "#ecebe6", fg: "#2b2f2a", pal: ["#6c7a6b", "#c8ccbf", "#2b2f2a", "#f7f6f1"], h: 150 },
  ],
  [
    { name: "Nocturne", tag: "Music", bg: "#241437", fg: "#f4d6ff", pal: ["#ff7a59", "#4a2c6d", "#f4d6ff", "#120a1c"], h: 220 },
    { name: "Tidewater", tag: "Travel", bg: "#d9ecf2", fg: "#10303b", pal: ["#0b5d7a", "#5fb3c9", "#f1d9a7", "#10303b"], h: 150 },
    { name: "Parchment", tag: "Publishing", bg: "#f6efdd", fg: "#2a2a2a", pal: ["#8c2f2f", "#c9b27c", "#2a2a2a", "#fffaf0"], h: 200 },
  ],
  [
    { name: "Foundry", tag: "Industrial", bg: "#e6e3dc", fg: "#161616", pal: ["#e5471f", "#3a3a38", "#b9b5aa", "#161616"], h: 170 },
    { name: "Ember", tag: "Gaming", bg: "#1b0f0d", fg: "#f6e7d8", pal: ["#ff5a36", "#ffb703", "#3a1d17", "#f6e7d8"], h: 220 },
    { name: "Lumen", tag: "Health", bg: "#e9f4ff", fg: "#12263a", pal: ["#2563a8", "#9cc8ee", "#f4b860", "#12263a"], h: 160 },
  ],
];

export default function Moodboard() {
  return (
    <div className="moodboard" aria-hidden="true">
      {COLUMNS.map((col, ci) => (
        <div className={`mood-col mood-col-${ci}`} key={ci}>
          <div className="mood-track" style={{ animationDuration: `${46 + ci * 6}s` }}>
          {[...col, ...col].map((c, k) => (
            <div className="mood-card" key={`${c.name}-${k}`}>
              <div className="mood-top" style={{ background: c.bg, color: c.fg, minHeight: c.h }}>
                <span className="mood-tag" style={{ color: c.fg }}>
                  {c.tag}
                </span>
                <span className="mood-name">{c.name}</span>
              </div>
              <div className="mood-swatches">
                {c.pal.map((p) => (
                  <span key={p} style={{ background: p }} />
                ))}
              </div>
            </div>
          ))}
          </div>
        </div>
      ))}
    </div>
  );
}
