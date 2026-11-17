import type { ColorSystem, FontPairing, MotionSystem, SpacingSystem, DesignPreset } from "./types.js";
import { SPACING_SYSTEMS } from "./spacing.js";
import { MOTION_SYSTEMS } from "./motion.js";

// ---------------------------------------------------------------------------
// 100+ curated design presets.
//
// Each preset is a complete, hand-tuned design identity: a palette with real
// surface/text/border roles (light OR dark), a type pairing, a radius/spacing
// system and a motion feel. They are *inspired by* the design languages of the
// best product UIs and component libraries (shadcn/ui, Radix Colors, Linear,
// Vercel/Geist, Stripe, Raycast, Supabase, Aceternity, Magic UI, GOV.UK, Swiss
// editorial, neo-brutalism...). Nothing is copied verbatim — the point is to
// give every brief a distinct, intentional look instead of one default.
// ---------------------------------------------------------------------------

const SP: Record<string, string> = {
  sd: "Sharp & Dense",
  sa: "Soft & Airy",
  bc: "Boxy & Confident",
  rf: "Round & Friendly",
  tt: "Tight & Technical",
  ge: "Generous & Editorial",
  cd: "Compact & Dense",
  an: "Asymmetric Notch",
  pw: "Pillowy",
};

const MO: Record<string, string> = {
  sn: "Snappy",
  sm: "Smooth",
  de: "Deliberate",
  bo: "Bouncy",
  mi: "Minimal",
  el: "Elastic",
  cr: "Crisp",
  we: "Weighted",
};

function spacingByKey(key: string): SpacingSystem {
  const s = SPACING_SYSTEMS.find((x) => x.name === SP[key]);
  if (!s) throw new Error(`Unknown spacing key "${key}"`);
  return s;
}

function motionByKey(key: string): MotionSystem {
  const m = MOTION_SYSTEMS.find((x) => x.name === MO[key]);
  if (!m) throw new Error(`Unknown motion key "${key}"`);
  return m;
}

type Face = [family: string, weights: number[]];

function face([family, weights]: Face): FontPairing["heading"] {
  const wght = weights.length === 1 && weights[0] === 400 ? "" : `:wght@${weights.join(";")}`;
  return {
    family,
    weights,
    googleFontUrl: `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}${wght}&display=swap`,
  };
}

// ---- tiny colour helpers (hex only, no deps) -------------------------------

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}

function mix(a: string, b: string, t: number): string {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

/** WCAG relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Nudge `fg` toward `toward` until it reaches `min` contrast on `bg`. */
function ensureContrast(fg: string, bg: string, toward: string, min: number): string {
  let out = fg;
  for (let t = 0.05; contrast(out, bg) < min && t <= 1; t += 0.05) out = mix(fg, toward, t);
  return out;
}

function readableOn(bg: string): string {
  return contrast(bg, "#ffffff") >= contrast(bg, "#0b0b0b") ? "#ffffff" : "#0b0b0b";
}

// ---- row format -------------------------------------------------------------
// [id, name, inspiredBy, moods, industries, mode, [bg, surface, text, muted, border],
//  [primary, secondary, accent], headingFace, bodyFace, spacingKey, motionKey, personality]
type Row = [
  string,
  string,
  string,
  string[],
  string[],
  "light" | "dark",
  [string, string, string, string, string],
  [string, string, string],
  Face,
  Face,
  string,
  string,
  string,
];

const ROWS: Row[] = [
  // ───────── Developer & product tooling ─────────
  ["obsidian-terminal", "Obsidian Terminal", "Linear-style precision", ["technical", "minimal", "modern"], ["dev", "saas", "ai", "productivity", "software"], "dark", ["#0a0b0d", "#121418", "#e8eaed", "#8b919c", "#23262d"], ["#5eead4", "#38bdf8", "#f5d90a"], ["Geist", [500, 600]], ["Geist", [400, 500]], "tt", "cr", "precise, quiet, built for people who live in the keyboard"],
  ["phosphor-green", "Phosphor Green", "CRT terminal, hacker culture", ["technical", "bold"], ["dev", "security", "crypto", "hacker"], "dark", ["#050a06", "#0b130d", "#d7f5dc", "#6f9b78", "#1b2b1f"], ["#39ff88", "#1fd1a6", "#ffd23f"], ["Space Mono", [700]], ["JetBrains Mono", [400, 500]], "sd", "mi", "raw, monospaced, unapologetically nerdy"],
  ["mono-edge", "Mono Edge", "Vercel / Geist monochrome", ["minimal", "technical", "modern"], ["dev", "saas", "platform", "cloud"], "light", ["#ffffff", "#fafafa", "#0a0a0a", "#737373", "#e5e5e5"], ["#0a0a0a", "#525252", "#0070f3"], ["Geist", [600, 700]], ["Geist", [400, 500]], "tt", "cr", "stark black and white with one electric accent"],
  ["zinc-ledger", "Zinc Ledger", "shadcn/ui zinc, reworked", ["minimal", "modern", "trustworthy"], ["saas", "productivity", "dev", "b2b"], "light", ["#fafafa", "#ffffff", "#18181b", "#71717a", "#e4e4e7"], ["#18181b", "#52525b", "#f97316"], ["Instrument Sans", [600, 700]], ["Instrument Sans", [400, 500]], "tt", "sm", "neutral and orderly with a single hot orange signal"],
  ["aurora-glow", "Aurora Glow", "Aceternity-style glowing dark UI", ["bold", "energetic", "modern"], ["ai", "saas", "startup", "tech"], "dark", ["#05060f", "#0d0f1f", "#eef0ff", "#8a90b8", "#1d2040"], ["#22d3ee", "#a3e635", "#f472b6"], ["Onest", [600, 700]], ["Onest", [400, 500]], "an", "sm", "luminous, high-contrast, a touch of spectacle"],
  ["slate-amber", "Slate & Amber", "Radix Colors slate with amber", ["calm", "trustworthy"], ["saas", "dev", "productivity", "tools"], "light", ["#fcfcfd", "#f9f9fb", "#1c2024", "#60646c", "#e0e1e6"], ["#ab6400", "#60646c", "#e5484d"], ["Figtree", [600, 700]], ["Figtree", [400, 500]], "rf", "sm", "calm and legible, warmed by a deep amber"],
  ["ember-command", "Ember Command", "Raycast-style launcher dark", ["bold", "technical"], ["productivity", "dev", "tools", "launcher"], "dark", ["#101011", "#1a1a1c", "#f4f4f5", "#939399", "#2a2a2e"], ["#ff6363", "#ffb36b", "#6ee7b7"], ["Hanken Grotesk", [600, 700]], ["Hanken Grotesk", [400, 500]], "cd", "cr", "fast, dense, command-palette confident"],
  ["emerald-stack", "Emerald Stack", "Supabase-style open-source dark", ["technical", "energetic"], ["dev", "database", "data", "backend", "open source"], "dark", ["#121212", "#1c1c1c", "#ededed", "#898989", "#2e2e2e"], ["#3ecf8e", "#1f9d6b", "#f5c518"], ["Plus Jakarta Sans", [600, 700]], ["Plus Jakarta Sans", [400, 500]], "tt", "sn", "friendly open-source energy with serious engineering"],
  ["blueprint", "Blueprint", "Technical drawing, drafting paper", ["technical", "trustworthy"], ["engineering", "architecture", "construction", "hardware"], "dark", ["#0b2540", "#10325a", "#e6f0ff", "#8fb0d6", "#1d4a7c"], ["#ffffff", "#7dd3fc", "#fcd34d"], ["Space Grotesk", [500, 700]], ["IBM Plex Mono", [400, 500]], "sd", "mi", "measured, annotated, drawn with a ruler"],
  ["docs-paper", "Docs Paper", "GitHub Docs readability", ["calm", "trustworthy"], ["dev", "docs", "education", "documentation"], "light", ["#ffffff", "#f6f8fa", "#1f2328", "#59636e", "#d1d9e0"], ["#116329", "#0550ae", "#bf8700"], ["Fira Sans", [600, 700]], ["Fira Sans", [400, 500]], "cd", "mi", "clear, linkable, made to be read for hours"],

  // ───────── Finance & trust ─────────
  ["ledger-green", "Ledger Green", "Stripe-era fintech confidence", ["trustworthy", "calm"], ["fintech", "banking", "payments", "finance"], "light", ["#f7faf8", "#ffffff", "#0f2a1d", "#5b7266", "#d9e6de"], ["#0b6b4a", "#0f766e", "#d97706"], ["Newsreader", [600, 700]], ["Public Sans", [400, 500]], "tt", "sm", "numerate, composed, a serif that signs the cheque"],
  ["vault-navy", "Vault Navy", "Private bank, brass fittings", ["premium", "trustworthy"], ["fintech", "banking", "wealth", "private"], "dark", ["#0a1424", "#101e35", "#eef2f8", "#8d9bb3", "#1f3050"], ["#c9a24b", "#7aa2d6", "#e8e1cf"], ["Cormorant Garamond", [600, 700]], ["Manrope", [400, 500]], "ge", "de", "discreet, old-money, gold on deep navy"],
  ["payday-lime", "Payday Lime", "Wise / Mercury friendly money", ["playful", "trustworthy", "energetic"], ["fintech", "payments", "neobank", "transfer"], "light", ["#f4f9ef", "#ffffff", "#14250e", "#5d7050", "#d8e6cb"], ["#163300", "#9fe870", "#ffd11a"], ["Figtree", [700, 800]], ["Figtree", [400, 500]], "rf", "bo", "money without the stiff collar"],
  ["tax-ink", "Tax Ink", "Accountant's stationery", ["trustworthy", "minimal"], ["accounting", "legal", "tax", "finance"], "light", ["#fbfaf6", "#ffffff", "#1b1b1b", "#6b6b66", "#dedbd0"], ["#1f3a5f", "#8c2f39", "#b08d57"], ["Libre Caslon Text", [400, 700]], ["Source Sans 3", [400, 500]], "ge", "mi", "ink-on-paper, ledger lines, zero fluff"],
  ["neon-exchange", "Neon Exchange", "Crypto trading terminal", ["bold", "energetic", "technical"], ["crypto", "web3", "trading", "exchange"], "dark", ["#070809", "#101214", "#f1f3f4", "#7b8389", "#1f2326"], ["#c6ff3d", "#00e0ff", "#ff4d6d"], ["Unbounded", [600, 700]], ["Manrope", [400, 500]], "bc", "sn", "market-hours adrenaline, green candles"],
  ["coin-cream", "Coin Cream", "Warm consumer savings app", ["warm", "playful"], ["fintech", "savings", "kids", "budget"], "light", ["#fff7ea", "#ffffff", "#2a1a0a", "#7a6552", "#f0dfc5"], ["#e8590c", "#2b8a3e", "#fcc419"], ["Fraunces", [600, 800]], ["DM Sans", [400, 500]], "pw", "bo", "piggy-bank cheerful, serif with a wink"],
  ["wealth-slate", "Wealth Slate", "Portfolio dashboard calm", ["calm", "premium"], ["wealth", "investing", "fintech", "portfolio"], "light", ["#f3f5f7", "#ffffff", "#101828", "#667085", "#dde2e8"], ["#0e7490", "#334155", "#b45309"], ["IBM Plex Sans", [600, 700]], ["IBM Plex Sans", [400, 500]], "tt", "sm", "long-horizon patience in cool slate"],
  ["cover-sky", "Cover Sky", "Insurance, but approachable", ["calm", "trustworthy", "warm"], ["insurance", "health", "benefits"], "light", ["#f2f8fb", "#ffffff", "#0d2b3a", "#587585", "#d3e5ee"], ["#0b7285", "#5c940d", "#f08c00"], ["Red Hat Display", [700, 800]], ["Red Hat Text", [400, 500]], "rf", "sm", "reassuring, clear skies, no fine print energy"],

  // ───────── Health & wellness ─────────
  ["clinic-mint", "Clinic Mint", "Modern primary care", ["calm", "trustworthy"], ["health", "healthcare", "medical", "clinic"], "light", ["#f3faf7", "#ffffff", "#0e2a24", "#54746c", "#d4e8e1"], ["#0f766e", "#84a98c", "#e07a5f"], ["Figtree", [600, 700]], ["Figtree", [400, 500]], "rf", "sm", "clean air and clear instructions"],
  ["sage-studio", "Sage Studio", "Boutique spa and yoga", ["calm", "minimal", "premium"], ["wellness", "spa", "yoga", "retreat"], "light", ["#f4f2ec", "#fbfaf6", "#26302a", "#7a857c", "#dcdccf"], ["#5b7553", "#a68a64", "#c9ada7"], ["Cormorant Garamond", [500, 600]], ["Jost", [400, 500]], "sa", "de", "slow breath, sage and stone"],
  ["pulse-coral", "Pulse Coral", "Strava-style training energy", ["energetic", "bold"], ["fitness", "sports", "health", "running"], "dark", ["#0f0f10", "#19191b", "#fafafa", "#9a9a9f", "#2a2a2d"], ["#ff5a36", "#ffd166", "#06d6a0"], ["Barlow Condensed", [700]], ["Barlow", [400, 500]], "sd", "sn", "heart-rate high, coach shouting your name"],
  ["therapy-peach", "Therapy Peach", "Warm mental-health support", ["warm", "calm"], ["mental health", "therapy", "wellness", "counseling"], "light", ["#fdf3ec", "#fff9f5", "#3a2a24", "#86695d", "#f2d9c9"], ["#c8553d", "#7d8f69", "#e9b872"], ["Newsreader", [500, 600]], ["Nunito Sans", [400, 500]], "pw", "sm", "a soft chair and a kind voice"],
  ["pharma-clean", "Pharma Clean", "Pharmacy and lab clarity", ["trustworthy", "minimal"], ["pharmacy", "medical", "health", "lab"], "light", ["#ffffff", "#f4f7f9", "#12262f", "#5b707a", "#dbe5ea"], ["#00796b", "#00acc1", "#f4511e"], ["Public Sans", [600, 700]], ["Public Sans", [400, 500]], "tt", "mi", "sterile in the good way, dosage-label legible"],
  ["sleep-dusk", "Sleep Dusk", "Meditation and sleep apps", ["calm", "premium"], ["wellness", "sleep", "meditation", "mindfulness"], "dark", ["#0e1a1f", "#152730", "#e7f0f2", "#85a0a8", "#223b45"], ["#f2c879", "#7fb7be", "#d98e73"], ["Fraunces", [500, 600]], ["Albert Sans", [400, 500]], "sa", "de", "lights down, lantern glow"],
  ["fit-volt", "Fit Volt", "Gym-floor black and volt", ["bold", "energetic"], ["fitness", "gym", "sports", "training"], "light", ["#f7f7f2", "#ffffff", "#111111", "#666666", "#deded4"], ["#111111", "#d4ff00", "#ff3d00"], ["Archivo", [800, 900]], ["Archivo", [400, 500]], "bc", "sn", "chalk dust, heavy plates, loud type"],
  ["paw-print", "Paw Print", "Pet care and vet clinics", ["playful", "warm"], ["pets", "veterinary", "animals"], "light", ["#fff8ee", "#ffffff", "#33261a", "#8a6f57", "#f1dfc4"], ["#ef6c00", "#2e7d6b", "#ffcc4d"], ["Baloo 2", [600, 800]], ["Nunito", [400, 600]], "pw", "bo", "wagging tail, muddy paws, big heart"],

  // ───────── Food & hospitality ─────────
  ["trattoria", "Trattoria", "Italian family restaurant", ["warm", "premium"], ["restaurant", "food", "italian", "dining"], "light", ["#f8efe0", "#fdf8ee", "#2b1810", "#85685a", "#e6d3b6"], ["#a4262c", "#3f6b3a", "#d9a441"], ["Playfair Display", [600, 800]], ["Lora", [400, 500]], "ge", "de", "checked tablecloths and long lunches"],
  ["izakaya-night", "Izakaya Night", "Late-night ramen counter", ["bold", "energetic"], ["restaurant", "food", "bar", "ramen"], "dark", ["#130e0c", "#1f1613", "#f6ece4", "#a38b7e", "#33241e"], ["#ff7a1a", "#e63946", "#ffd166"], ["Bricolage Grotesque", [700, 800]], ["DM Sans", [400, 500]], "an", "sn", "steam, neon, a stool at the counter"],
  ["coffee-roast", "Coffee Roast", "Specialty coffee roasters", ["warm", "minimal"], ["coffee", "cafe", "food", "roastery"], "light", ["#f1e8dc", "#f8f1e6", "#2d1b12", "#7d6555", "#dccbb4"], ["#4a2c1a", "#b5651d", "#d9b38c"], ["Young Serif", [400]], ["Work Sans", [400, 500]], "bc", "sm", "single-origin, hand-written menu board"],
  ["farm-table", "Farm Table", "Organic farm and market", ["warm", "calm"], ["food", "agriculture", "grocery", "farm", "organic"], "light", ["#f6f4e8", "#fcfbf3", "#24301a", "#6d7a58", "#dddcc0"], ["#55702f", "#c8553d", "#e6b84a"], ["Zilla Slab", [500, 700]], ["Karla", [400, 500]], "rf", "sm", "soil, seasons and honest labels"],
  ["citrus-stand", "Citrus Stand", "Fresh juice and bright food brands", ["playful", "energetic"], ["food", "beverage", "juice", "snacks"], "light", ["#fff4e0", "#fffaf0", "#2e1a0e", "#8a6a4a", "#f3d9a8"], ["#f2542d", "#0e9594", "#f5d547"], ["Gloock", [400]], ["Outfit", [400, 500]], "pw", "bo", "squeezed to order, sticky fingers"],
  ["bar-noir", "Bar Noir", "Speakeasy cocktail bar", ["premium", "bold"], ["bar", "nightlife", "restaurant", "cocktail"], "dark", ["#0c0a09", "#171311", "#f3e9dc", "#9b8b7a", "#2b231e"], ["#d4a24c", "#8c2f39", "#e9d8b4"], ["Bodoni Moda", [600, 800]], ["Jost", [400, 500]], "bc", "de", "candlelight, brass, a password at the door"],
  ["bakery-pastel", "Bakery Pastel", "Patisserie and dessert shops", ["playful", "warm"], ["bakery", "food", "dessert", "patisserie"], "light", ["#fff1f0", "#fff9f8", "#4a2326", "#9a6a6c", "#f6d3d0"], ["#d6455d", "#f2a65a", "#7fb685"], ["DM Serif Display", [400]], ["DM Sans", [400, 500]], "pw", "el", "sugar-dusted, pastel box, ribbon tied"],
  ["linen-stay", "Linen Stay", "Boutique hotel linens", ["premium", "calm"], ["hospitality", "hotel", "travel", "resort"], "light", ["#f5f1ea", "#fbf9f5", "#2a2724", "#857e74", "#ddd5c7"], ["#8a6f47", "#4b5a52", "#c2a878"], ["Cormorant Garamond", [500, 600]], ["Hanken Grotesk", [400, 500]], "ge", "de", "pressed sheets, brass keys, a late checkout"],

  // ───────── Fashion, beauty, luxury ─────────
  ["maison-noir", "Maison Noir", "Luxury fashion house", ["premium", "minimal"], ["fashion", "luxury", "couture"], "dark", ["#0a0a0a", "#141414", "#f5f1ea", "#9d968a", "#2a2826"], ["#f5f1ea", "#b89b5e", "#8c8c8c"], ["Bodoni Moda", [400, 500]], ["Hanken Grotesk", [400, 500]], "bc", "de", "runway lighting, whisper-quiet captions"],
  ["atelier-bone", "Atelier Bone", "Editorial fashion lookbook", ["minimal", "premium"], ["fashion", "editorial", "apparel"], "light", ["#efebe4", "#f7f4ef", "#171513", "#7b756c", "#d6d0c4"], ["#171513", "#a3492f", "#c8bfae"], ["Instrument Serif", [400]], ["Instrument Sans", [400, 500]], "ge", "cr", "bone paper, big serif, plenty of air"],
  ["glow-blush", "Glow Blush", "Skincare and clean beauty", ["warm", "calm", "premium"], ["skincare", "beauty", "cosmetics", "self-care"], "light", ["#fbefec", "#fff8f6", "#3b2326", "#94686b", "#f1d6d1"], ["#a8435a", "#7a8f6a", "#e0a96d"], ["Cormorant Garamond", [600, 700]], ["Mulish", [400, 500]], "sa", "sm", "dewy, soft-focus, ingredient-forward"],
  ["salon-chroma", "Salon Chroma", "Hair colour and bold beauty", ["bold", "playful"], ["beauty", "salon", "hair", "makeup"], "light", ["#ffffff", "#f5f5f5", "#111111", "#666666", "#e5e5e5"], ["#ff2e63", "#08d9d6", "#ffe600"], ["Syne", [700, 800]], ["Manrope", [400, 500]], "an", "bo", "dyed fringe, hot pink, no apologies"],
  ["jewel-emerald", "Jewel Emerald", "Fine jewellery counter", ["premium"], ["jewelry", "luxury", "watches", "gifts"], "dark", ["#07140f", "#0e211a", "#efe9d6", "#8fa89b", "#1a3a2e"], ["#d4af37", "#2f8f6b", "#f0e6c8"], ["Playfair Display", [500, 700]], ["Red Hat Text", [400, 500]], "ge", "de", "velvet tray, gold prongs, green baize"],
  ["street-acid", "Street Acid", "Streetwear drops", ["bold", "energetic", "playful"], ["fashion", "streetwear", "gaming", "apparel"], "light", ["#f2f2ee", "#ffffff", "#0c0c0c", "#5c5c5c", "#cfcfc8"], ["#0c0c0c", "#ff4f00", "#c6f432"], ["Anton", [400]], ["Archivo", [400, 500]], "sd", "sn", "sticker-bombed, loud, limited quantity"],
  ["thrift-denim", "Thrift Denim", "Circular and sustainable fashion", ["warm", "calm"], ["fashion", "sustainability", "ecommerce", "resale"], "light", ["#f1f3ef", "#ffffff", "#1d2a22", "#667467", "#d5dbd0"], ["#2f5d50", "#c26a3d", "#e6c36a"], ["Fraunces", [600, 800]], ["Albert Sans", [400, 500]], "rf", "sm", "second-hand, first-rate, stitched with care"],
  ["amber-scent", "Amber Scent", "Perfume and fragrance", ["premium", "warm"], ["fragrance", "beauty", "luxury", "perfume"], "dark", ["#140d08", "#1f150d", "#f3e6d3", "#a58d73", "#36251a"], ["#e0a458", "#9c4a2f", "#f3e6d3"], ["Italiana", [400]], ["Jost", [400, 500]], "sa", "de", "resin, smoke, a drop of warm oil"],

  // ───────── Creative, studios, portfolios ─────────
  ["brutalist-paper", "Brutalist Paper", "Neo-brutalism, hard shadows", ["bold", "playful"], ["creative", "agency", "design", "startup"], "light", ["#fff6e5", "#ffffff", "#000000", "#444444", "#000000"], ["#ffdd00", "#ff6b6b", "#4dabf7"], ["Space Grotesk", [700]], ["Space Grotesk", [400, 500]], "bc", "sn", "thick outlines, offset shadows, zero polish"],
  ["gallery-white", "Gallery White", "Museum label minimalism", ["minimal", "premium"], ["art", "gallery", "museum", "exhibition"], "light", ["#ffffff", "#f7f7f7", "#111111", "#777777", "#e3e3e3"], ["#111111", "#b3261e", "#777777"], ["Instrument Serif", [400]], ["Hanken Grotesk", [400, 500]], "ge", "mi", "white cube, wall text, one red dot"],
  ["riso-press", "Riso Press", "Risograph print studio", ["playful", "bold"], ["creative", "print", "publishing", "illustration"], "light", ["#f6f1e6", "#fffaf0", "#1b2a49", "#6b6f85", "#d9cfb8"], ["#ff48b0", "#0078bf", "#ffe800"], ["Gabarito", [700, 800]], ["DM Sans", [400, 500]], "an", "bo", "misregistered ink, overprint, paper grain"],
  ["cinema-reel", "Cinema Reel", "Film and title sequences", ["bold", "premium"], ["film", "media", "entertainment", "cinema"], "dark", ["#0b0b0c", "#151516", "#ece7dd", "#8d877b", "#262624"], ["#d64933", "#e8c872", "#5b8c85"], ["Bebas Neue", [400]], ["Work Sans", [400, 500]], "sd", "we", "projector flicker, a title card, the house lights down"],
  ["studio-mono", "Studio Mono", "Typographic design studio", ["minimal", "bold"], ["agency", "design", "creative", "studio"], "light", ["#ecebe6", "#f6f5f1", "#0f0f0f", "#6e6d68", "#cfcec7"], ["#0f0f0f", "#e63312", "#6e6d68"], ["Familjen Grotesk", [600, 700]], ["Familjen Grotesk", [400, 500]], "bc", "cr", "all type, one red mark, grid you can feel"],
  ["darkroom", "Darkroom", "Photographer's portfolio", ["minimal", "premium"], ["photography", "portfolio", "photographer"], "dark", ["#0d0d0d", "#181818", "#eaeaea", "#8a8a8a", "#2b2b2b"], ["#ff3b30", "#d4d4d4", "#f5c542"], ["Newsreader", [400, 500]], ["Instrument Sans", [400, 500]], "ge", "de", "safelight red, contact sheets, images first"],
  ["xerox-zine", "Xerox Zine", "Punk zine and DIY press", ["bold", "playful"], ["media", "music", "publishing", "zine"], "light", ["#ececec", "#fafafa", "#0a0a0a", "#555555", "#bdbdbd"], ["#0a0a0a", "#ff2a2a", "#fff200"], ["Rubik", [700, 800]], ["IBM Plex Mono", [400, 500]], "sd", "mi", "photocopied, stapled, cut and pasted"],
  ["motion-lab", "Motion Lab", "Animation and video studios", ["energetic", "bold"], ["video", "animation", "creative", "motion"], "dark", ["#0d0d0f", "#17171a", "#f6f6f8", "#9494a0", "#26262b"], ["#ff6a3d", "#3ddc97", "#ffd23f"], ["Unbounded", [500, 700]], ["Albert Sans", [400, 500]], "an", "el", "keyframes, easing curves, overshoot on purpose"],

  // ───────── Education, kids, non-profit ─────────
  ["chalkboard", "Chalkboard", "Classroom chalk and slate", ["warm", "playful"], ["education", "school", "teaching", "tutoring"], "dark", ["#1d2b27", "#25362f", "#f2f0e6", "#9db3a6", "#35493f"], ["#f4d35e", "#ee964b", "#8fd694"], ["Patua One", [400]], ["Nunito", [400, 600]], "rf", "bo", "dusty chalk, gold stars, first day of term"],
  ["scholar-ink", "Scholar Ink", "University and research press", ["trustworthy", "calm"], ["education", "university", "research", "academic"], "light", ["#faf8f3", "#ffffff", "#1e1b18", "#6a645b", "#e3ddd0"], ["#7a1f2b", "#234e70", "#b8860b"], ["Crimson Pro", [600, 700]], ["Source Sans 3", [400, 500]], "ge", "sm", "oak library, crimson binding, footnotes"],
  ["crayon-box", "Crayon Box", "Kids learning and toys", ["playful", "energetic"], ["kids", "education", "toys", "children"], "light", ["#fffbe6", "#ffffff", "#2b2d42", "#6d6f87", "#f3e9a8"], ["#ff6b35", "#1a936f", "#ffc914"], ["Fredoka", [600, 700]], ["Nunito", [400, 600]], "pw", "el", "waxy, bouncy, colour outside the lines"],
  ["civic-fund", "Civic Fund", "Non-profit and charity", ["trustworthy", "warm"], ["nonprofit", "charity", "foundation", "community"], "light", ["#f8f5ef", "#ffffff", "#20262e", "#626b75", "#e1dccf"], ["#b3392f", "#1f5f5b", "#e7a93b"], ["Merriweather", [700, 900]], ["Source Sans 3", [400, 500]], "rf", "sm", "human, accountable, impact you can see"],
  ["study-notes", "Study Notes", "Notebook and note-taking", ["calm", "minimal"], ["education", "productivity", "notes", "learning"], "light", ["#fbfbf8", "#ffffff", "#26261f", "#77776a", "#e5e5d8"], ["#2f6f5e", "#d9822b", "#a23e48"], ["Literata", [500, 700]], ["Literata", [400, 500]], "ge", "mi", "margins, highlighter, a quiet desk lamp"],
  ["parrot-lingo", "Parrot Lingo", "Gamified language learning", ["playful", "energetic"], ["education", "language", "learning", "gamified"], "light", ["#f7fbf2", "#ffffff", "#1f2a14", "#67775a", "#dcebc9"], ["#58a700", "#ff9600", "#1cb0f6"], ["Baloo 2", [700, 800]], ["Nunito", [400, 600]], "pw", "bo", "streaks, confetti, tiny victories"],
  ["library-oak", "Library Oak", "Bookshops and libraries", ["warm", "calm"], ["books", "publishing", "library", "bookstore"], "light", ["#f3ebdd", "#faf4e8", "#2e2218", "#7a6a58", "#ddcfb6"], ["#6b4423", "#3e5f4b", "#b88a44"], ["EB Garamond", [500, 700]], ["Karla", [400, 500]], "ge", "de", "leather spines, brass lamp, quiet stacks"],
  ["lab-bench", "Lab Bench", "STEM and biotech research", ["technical", "trustworthy"], ["science", "research", "biotech", "lab"], "light", ["#f6f8fa", "#ffffff", "#0e1d26", "#5a6c78", "#d8e1e7"], ["#0a7c86", "#d1495b", "#edae49"], ["Space Grotesk", [500, 700]], ["IBM Plex Sans", [400, 500]], "tt", "cr", "pipettes, petri dishes, reproducible results"],

  // ───────── Travel, outdoors, mobility ─────────
  ["trail-topo", "Trail Topo", "Outdoor and hiking gear", ["calm", "bold", "warm"], ["outdoor", "travel", "hiking", "camping"], "light", ["#f2efe6", "#faf8f1", "#25301f", "#6b7457", "#d9d5c0"], ["#3d5a2a", "#c4622d", "#e0b94a"], ["Bitter", [600, 800]], ["Public Sans", [400, 500]], "bc", "sm", "contour lines, trail mix, dirt on the boots"],
  ["coastline", "Coastline", "Beach and island travel", ["calm", "energetic"], ["travel", "hospitality", "tourism", "beach"], "light", ["#f1f9f9", "#ffffff", "#0c2e36", "#4f7882", "#cfe6e8"], ["#0e7c86", "#ff7a59", "#f7c948"], ["Outfit", [600, 700]], ["Nunito Sans", [400, 500]], "rf", "sm", "salt air, shallow water, sun on skin"],
  ["nomad-sun", "Nomad Sun", "Adventure and trip planning", ["energetic", "playful", "warm"], ["travel", "tourism", "adventure", "trips"], "light", ["#fff3dc", "#fffaf0", "#2a1b0b", "#86683f", "#f4d9a2"], ["#e4572e", "#17bebb", "#ffc914"], ["Bricolage Grotesque", [700, 800]], ["Work Sans", [400, 500]], "an", "bo", "passport stamps, sunburn, one-way ticket"],
  ["estate-stone", "Estate Stone", "Premium real estate", ["premium", "trustworthy"], ["real estate", "property", "housing", "realty"], "light", ["#f2f0ec", "#ffffff", "#1f2224", "#6b7074", "#d9d6cf"], ["#1f3d36", "#a67c52", "#1f2224"], ["Playfair Display", [600, 700]], ["Manrope", [400, 500]], "ge", "sm", "stone, timber, a long driveway"],
  ["atlas-night", "Atlas Night", "Maps, mobility and dispatch", ["technical", "bold"], ["mobility", "logistics", "transport", "maps"], "dark", ["#101214", "#1a1d20", "#f1f3f4", "#8e969c", "#2c3136"], ["#ffb000", "#00c2a8", "#ff5c5c"], ["Barlow", [600, 700]], ["Barlow", [400, 500]], "cd", "cr", "night route, amber ETA, no wrong turns"],
  ["garage-chrome", "Garage Chrome", "Automotive and performance", ["bold", "premium"], ["automotive", "cars", "motorsport", "garage"], "dark", ["#0c0d0e", "#17191b", "#f2f3f4", "#8b9196", "#2a2d30"], ["#e10600", "#c0c4c8", "#f2f3f4"], ["Oswald", [500, 700]], ["Archivo", [400, 500]], "sd", "we", "brushed metal, racing red, torque"],
  ["volt-grid", "Volt Grid", "EV and clean-tech", ["energetic", "modern"], ["energy", "cleantech", "automotive", "ev"], "light", ["#f4f7f2", "#ffffff", "#12201a", "#5d7066", "#d8e3d5"], ["#1b4332", "#8fbf00", "#ff8a00"], ["Sora", [600, 700]], ["Manrope", [400, 500]], "tt", "sn", "silent power, charge bars, forest-dark"],
  ["solar-dawn", "Solar Dawn", "Solar and renewable energy", ["warm", "energetic"], ["energy", "solar", "sustainability", "renewable"], "light", ["#fff7e6", "#fffcf4", "#2b1d05", "#86703a", "#f2dfa8"], ["#d97706", "#0f766e", "#dc2626"], ["Epilogue", [700, 800]], ["Public Sans", [400, 500]], "bc", "sn", "first light on panels, honest numbers"],

  // ───────── Commerce & retail ─────────
  ["market-stall", "Market Stall", "Marketplaces and general retail", ["warm", "playful"], ["ecommerce", "marketplace", "retail", "shop"], "light", ["#fbf6ee", "#ffffff", "#2a2118", "#7a6a58", "#eadfcb"], ["#d9480f", "#2b8a3e", "#fab005"], ["DM Sans", [700]], ["DM Sans", [400, 500]], "rf", "sm", "hand-lettered price tags, canvas awning"],
  ["shelf-minimal", "Shelf Minimal", "Quiet direct-to-consumer", ["minimal", "calm"], ["ecommerce", "retail", "home", "dtc"], "light", ["#f7f6f3", "#ffffff", "#1b1b1a", "#75746f", "#e2e0d9"], ["#1b1b1a", "#b0623a", "#8c9a84"], ["Hanken Grotesk", [500, 700]], ["Hanken Grotesk", [400, 500]], "tt", "cr", "product on a plinth, nothing else"],
  ["woodgrain", "Woodgrain", "Furniture and interiors", ["warm", "premium"], ["furniture", "home", "interior", "decor"], "light", ["#f1e9dd", "#f9f4ea", "#2b2018", "#7e6b58", "#dccdb6"], ["#7a4a2b", "#4f6b5a", "#c79a5b"], ["Fraunces", [500, 700]], ["Work Sans", [400, 500]], "sa", "de", "oiled oak, linen, afternoon light"],
  ["sneaker-drop", "Sneaker Drop", "Hype retail and releases", ["bold", "energetic"], ["ecommerce", "fashion", "sneakers", "drops"], "dark", ["#0e0e0e", "#1a1a1a", "#ffffff", "#9a9a9a", "#2c2c2c"], ["#ccff00", "#ff3d71", "#ffffff"], ["Unbounded", [700, 800]], ["Archivo", [400, 500]], "sd", "sn", "queue at 6am, countdown timer, sold out"],
  ["grocery-fresh", "Grocery Fresh", "Grocery and delivery", ["warm", "energetic", "trustworthy"], ["grocery", "delivery", "food", "supermarket"], "light", ["#f4faee", "#ffffff", "#17301a", "#5a7a52", "#d5e7c6"], ["#2e7d32", "#ff6f00", "#ffd54f"], ["Nunito", [700, 800]], ["Nunito Sans", [400, 500]], "rf", "sm", "crisp lettuce, paper bag, at your door by six"],
  ["gift-ribbon", "Gift Ribbon", "Gifting and celebrations", ["playful", "warm"], ["gifts", "events", "celebration", "party"], "light", ["#fff1f5", "#ffffff", "#3a1a26", "#946078", "#f7d3de"], ["#c2185b", "#00897b", "#ffb300"], ["Lilita One", [400]], ["Quicksand", [500, 600]], "pw", "el", "wrapping paper, curly ribbon, surprise"],

  // ───────── Media, music, gaming ─────────
  ["vinyl-room", "Vinyl Room", "Music and audio culture", ["warm", "bold"], ["music", "audio", "podcast", "records"], "dark", ["#14100d", "#201a15", "#f2e8d8", "#a08f78", "#352c23"], ["#f5a524", "#e5484d", "#7ec8a4"], ["Fraunces", [700, 900]], ["Karla", [400, 500]], "an", "sm", "walnut, warm tubes, a needle drop"],
  ["arcade-pixel", "Arcade Pixel", "Retro gaming", ["playful", "bold"], ["gaming", "games", "retro", "arcade"], "dark", ["#0b0f14", "#131a22", "#e8f1f2", "#7d93a0", "#223040"], ["#ff3864", "#2de2e6", "#f6f740"], ["Press Start 2P", [400]], ["Space Mono", [400, 700]], "bc", "mi", "insert coin, high score, CRT scanlines"],
  ["esports-vortex", "Esports Vortex", "Esports and competitive gaming", ["bold", "energetic"], ["gaming", "esports", "tournaments", "streaming"], "dark", ["#090a0c", "#14161a", "#f3f5f7", "#8a93a0", "#23272e"], ["#ff3c00", "#00e5a8", "#ffffff"], ["Chakra Petch", [600, 700]], ["Chakra Petch", [400, 500]], "sd", "sn", "angular, fast, shout-cast ready"],
  ["podcast-signal", "Podcast Signal", "Podcasts and audio shows", ["warm", "minimal"], ["podcast", "media", "audio", "radio"], "light", ["#f5f0e8", "#ffffff", "#1a1612", "#766b5c", "#e1d8c8"], ["#e8590c", "#1a1612", "#2b8a8a"], ["Archivo", [700, 800]], ["Newsreader", [400, 500]], "an", "cr", "on-air light, foam mic, a good tangent"],
  ["newsroom-serif", "Newsroom Serif", "News and journalism", ["trustworthy", "minimal"], ["news", "media", "journalism", "magazine"], "light", ["#fafaf7", "#ffffff", "#121212", "#5f5f5a", "#dcdcd4"], ["#b00020", "#121212", "#1a5276"], ["Playfair Display", [700, 900]], ["Source Serif 4", [400, 500]], "ge", "mi", "broadsheet masthead, rules between columns"],
  ["stream-night", "Stream Night", "Streaming and video platforms", ["bold", "premium"], ["streaming", "video", "entertainment", "tv"], "dark", ["#0b1012", "#131b1f", "#eef3f4", "#86989e", "#223036"], ["#ff9f1c", "#2ec4b6", "#e71d36"], ["Red Hat Display", [700, 900]], ["Red Hat Text", [400, 500]], "pw", "sm", "dark room, glowing screen, one more episode"],
  ["comic-pow", "Comic Pow", "Comics and pop culture", ["playful", "bold"], ["comics", "kids", "entertainment", "manga"], "light", ["#fff8d6", "#ffffff", "#111111", "#555555", "#111111"], ["#ff3b30", "#0a84ff", "#ffd60a"], ["Bangers", [400]], ["Comic Neue", [400, 700]], "bc", "bo", "halftone dots, speech bubbles, KAPOW"],
  ["festival-sun", "Festival Sun", "Events, festivals and ticketing", ["energetic", "playful"], ["events", "festival", "tickets", "concerts"], "light", ["#fff0e5", "#ffffff", "#2b1305", "#8a5a3a", "#f7d2b5"], ["#ff4800", "#ff9e00", "#00a896"], ["Rubik", [700, 800]], ["Rubik", [400, 500]], "an", "bo", "wristbands, sunset set, a loud poster"],

  // ───────── B2B, enterprise, operations ─────────
  ["counsel-oxblood", "Counsel Oxblood", "Law firms and advisory", ["trustworthy", "premium"], ["legal", "law", "advisory", "consulting"], "light", ["#f7f4ef", "#ffffff", "#1f1a17", "#6f655c", "#ddd4c6"], ["#5c1a1b", "#1f2d3d", "#a88b4a"], ["Cormorant Garamond", [600, 700]], ["Source Sans 3", [400, 500]], "ge", "de", "oxblood binding, leather chairs, due diligence"],
  ["people-ops", "People Ops", "HR and team software", ["warm", "trustworthy"], ["hr", "recruiting", "people", "team"], "light", ["#fbf7f2", "#ffffff", "#261c18", "#7b6a60", "#ecdfd2"], ["#d1495b", "#00798c", "#edae49"], ["Albert Sans", [600, 700]], ["Albert Sans", [400, 500]], "rf", "sm", "approachable, human, onboarding without dread"],
  ["ops-grid", "Ops Grid", "Operational dashboards", ["technical", "minimal"], ["analytics", "operations", "data", "dashboard"], "light", ["#f4f4f2", "#ffffff", "#17181a", "#66686c", "#dcdcd8"], ["#0f766e", "#b45309", "#be123c"], ["Schibsted Grotesk", [600, 700]], ["Schibsted Grotesk", [400, 500]], "cd", "cr", "rows, filters, a status colour that means something"],
  ["sentinel", "Sentinel", "Cybersecurity and threat intel", ["technical", "bold", "trustworthy"], ["security", "cybersecurity", "infosec", "compliance"], "dark", ["#0a0e12", "#121920", "#e6edf3", "#7d8b99", "#1f2a35"], ["#00d1b2", "#ff5370", "#ffcb6b"], ["Space Grotesk", [600, 700]], ["JetBrains Mono", [400, 500]], "tt", "cr", "SOC at 3am, one red alert, logs scrolling"],
  ["data-atlas", "Data Atlas", "Business intelligence", ["calm", "technical"], ["analytics", "bi", "data", "reporting"], "light", ["#f5f7f6", "#ffffff", "#14211e", "#5e706b", "#d9e3df"], ["#234e52", "#dd6b20", "#2c7a7b"], ["Manrope", [700, 800]], ["Manrope", [400, 500]], "tt", "sm", "charts with opinions, one orange outlier"],
  ["freight-line", "Freight Line", "Logistics and supply chain", ["bold", "trustworthy"], ["logistics", "shipping", "supply chain", "freight"], "light", ["#f3f4f6", "#ffffff", "#111418", "#5b626b", "#d6d9de"], ["#111418", "#f2a900", "#d62828"], ["Archivo", [700, 800]], ["Archivo", [400, 500]], "sd", "sn", "pallets, hi-vis stripe, on time"],
  ["civic-clear", "Civic Clear", "Government and public services", ["trustworthy", "calm"], ["government", "civic", "public", "services"], "light", ["#ffffff", "#f3f2f1", "#0b0c0c", "#505a5f", "#b1b4b6"], ["#00703c", "#1d70b8", "#d4351c"], ["Public Sans", [700]], ["Public Sans", [400, 500]], "bc", "mi", "plain language, big targets, nobody left behind"],
  ["commons-sunrise", "Commons Sunrise", "Coworking and community", ["warm", "playful"], ["community", "coworking", "social", "membership"], "light", ["#fff5eb", "#ffffff", "#2b1a10", "#85654c", "#f6dfc6"], ["#ea580c", "#0f766e", "#facc15"], ["Bricolage Grotesque", [600, 800]], ["Work Sans", [400, 500]], "pw", "sm", "shared tables, morning coffee, door always open"],
  ["granite-b2b", "Granite B2B", "Enterprise sales platforms", ["trustworthy", "premium"], ["enterprise", "saas", "b2b", "sales"], "light", ["#f2f3f4", "#ffffff", "#16191d", "#636a72", "#d8dbde"], ["#1f4e5f", "#c06c34", "#16191d"], ["Libre Franklin", [600, 700]], ["Libre Franklin", [400, 500]], "tt", "sm", "boardroom-grade, copper trim, procurement-proof"],
  ["site-yellow", "Site Yellow", "Construction and industrial", ["bold", "trustworthy"], ["construction", "industrial", "manufacturing", "trades"], "light", ["#f4f2ea", "#ffffff", "#1a1a18", "#666357", "#d9d5c4"], ["#f2b705", "#1a1a18", "#d1472b"], ["Big Shoulders Display", [700, 800]], ["Public Sans", [400, 500]], "sd", "sn", "hard hats, hazard tape, load-bearing type"],

  // ───────── Distinct worlds ─────────
  ["concrete-arch", "Concrete Arch", "Architecture practices", ["minimal", "premium"], ["architecture", "design", "planning", "urban"], "light", ["#e9e8e4", "#f3f2ef", "#151515", "#6f6e69", "#cbcac4"], ["#151515", "#b5532a", "#8a8a85"], ["Syncopate", [700]], ["Hanken Grotesk", [400, 500]], "bc", "cr", "poured concrete, cantilevers, raking light"],
  ["mission-control", "Mission Control", "Aerospace and space tech", ["bold", "technical"], ["space", "aerospace", "science", "satellite"], "dark", ["#04070b", "#0b1218", "#e9f1f7", "#7f93a3", "#1a2733"], ["#ff6b35", "#9ad1d4", "#f4d35e"], ["Orbitron", [700, 800]], ["Exo 2", [400, 500]], "tt", "we", "countdown, telemetry, T-minus ten"],
  ["kelp-ocean", "Kelp Ocean", "Marine and climate work", ["calm", "trustworthy"], ["sustainability", "environment", "marine", "climate"], "dark", ["#08181c", "#0f2429", "#e2f1ef", "#7ea3a0", "#1b3a40"], ["#4fd1b5", "#e9c46a", "#f4a261"], ["Lexend", [500, 700]], ["Lexend", [400, 500]], "sa", "sm", "deep water, bioluminescence, tide tables"],
  ["garden-bloom", "Garden Bloom", "Gardening and botanicals", ["warm", "calm", "playful"], ["gardening", "plants", "home", "nursery"], "light", ["#f5f7ec", "#ffffff", "#1f2d17", "#66784f", "#dde6c6"], ["#3d7a3a", "#e0607e", "#f2c14e"], ["Gelasio", [700]], ["Mulish", [400, 500]], "rf", "sm", "terracotta pots, seed packets, green thumbs"],
  ["social-spark", "Social Spark", "Social and community apps", ["playful", "energetic"], ["social", "community", "app", "messaging"], "light", ["#ffffff", "#f7f7f8", "#16161a", "#6e6e78", "#e8e8ec"], ["#ff4d6d", "#ffb703", "#06b6d4"], ["Urbanist", [700, 800]], ["Urbanist", [400, 500]], "pw", "bo", "double-tap warm, always a little loud"],
  ["rose-vow", "Rose Vow", "Romance and dating", ["warm", "premium"], ["dating", "romance", "relationships"], "light", ["#fdf0f0", "#ffffff", "#3d1a22", "#9a6770", "#f5d2d4"], ["#9f1239", "#b8860b", "#4a6a5a"], ["Playfair Display", [500, 600]], ["Lora", [400, 500]], "sa", "de", "candlelit table for two, slow replies"],
  ["ivory-aisle", "Ivory Aisle", "Weddings and celebrations", ["premium", "calm"], ["wedding", "events", "celebration", "bridal"], "light", ["#faf6ee", "#ffffff", "#3a342b", "#8c8272", "#e8dfcc"], ["#8a9a7b", "#b79a5f", "#c7a4a0"], ["Cinzel", [500, 600]], ["Jost", [400, 500]], "sa", "de", "ivory stock, wax seal, calligraphy"],
  ["retro-diner", "Retro Diner", "1950s Americana", ["playful", "warm", "bold"], ["restaurant", "retro", "diner", "food"], "light", ["#fff4dc", "#fffaf0", "#2c1810", "#8a5a3c", "#f0d9a8"], ["#c8102e", "#0a7e8c", "#f4b400"], ["Alfa Slab One", [400]], ["Karla", [400, 500]], "bc", "bo", "chrome stools, jukebox, milkshake menu"],
  ["swiss-grid", "Swiss Grid", "International typographic style", ["minimal", "bold"], ["design", "agency", "tech", "architecture"], "light", ["#f4f4f2", "#ffffff", "#0a0a0a", "#6b6b6b", "#d0d0cc"], ["#e30613", "#0a0a0a", "#6b6b6b"], ["Be Vietnam Pro", [700, 800]], ["Be Vietnam Pro", [400, 500]], "bc", "cr", "flush-left, ragged-right, red as punctuation"],
  ["y2k-chrome", "Y2K Chrome", "Early-2000s optimism", ["playful", "bold"], ["fashion", "music", "tech", "nostalgia"], "light", ["#eef3f6", "#ffffff", "#0d1b2a", "#5b7083", "#cdd9e2"], ["#ff48c4", "#00b4d8", "#c6ff00"], ["Righteous", [400]], ["Quicksand", [500, 600]], "an", "el", "frosted plastic, glossy buttons, burned CD"],

  // ───────── Extra range: crafts, culture, niche ─────────
  ["ceramic-glaze", "Ceramic Glaze", "Craft pottery and makers", ["warm", "calm"], ["craft", "ceramics", "handmade", "makers"], "light", ["#f4efe6", "#fbf7f0", "#2a2420", "#7d7165", "#e0d6c4"], ["#2e6f73", "#c4733b", "#e1b86a"], ["Young Serif", [400]], ["Albert Sans", [400, 500]], "rf", "de", "thumb prints, kiln glaze, imperfect on purpose"],
  ["jazz-club", "Jazz Club", "Live music venues", ["premium", "warm"], ["music", "venue", "nightlife", "events"], "dark", ["#120d0b", "#1d1613", "#f1e4d3", "#a58e78", "#33261f"], ["#d9a441", "#b23a48", "#6bb3a8"], ["Playfair Display", [700, 900]], ["Karla", [400, 500]], "ge", "we", "brass, smoke, the second set"],
  ["tea-house", "Tea House", "Tea and slow-living brands", ["calm", "minimal", "warm"], ["tea", "wellness", "food", "beverage"], "light", ["#f1f0e4", "#f9f8ef", "#232b1e", "#727a63", "#d9d8c0"], ["#4a6b3a", "#a8703b", "#c9b27c"], ["Marcellus", [400]], ["Jost", [400, 500]], "sa", "de", "steeped slowly, matcha foam, bamboo whisk"],
  ["botanical-lab", "Botanical Lab", "Natural science and herbarium", ["calm", "trustworthy"], ["science", "botany", "nature", "research"], "light", ["#f3f5ee", "#fcfdf8", "#1c2a1a", "#6a7a62", "#d6dfc9"], ["#2d6a4f", "#9c6644", "#d4a373"], ["Spectral", [500, 700]], ["Karla", [400, 500]], "ge", "sm", "pressed leaves, Latin names, specimen labels"],
  ["night-market", "Night Market", "Street food and night culture", ["bold", "playful", "energetic"], ["food", "nightlife", "market", "street food"], "dark", ["#100b12", "#1a131d", "#f6eaf0", "#a8909f", "#301f36"], ["#ff4081", "#ffd24a", "#2ee6a6"], ["Rubik", [700, 800]], ["DM Sans", [400, 500]], "an", "bo", "paper lanterns, sizzling woks, neon signage"],
  ["clay-modern", "Clay Modern", "Architectural ceramics and interiors", ["minimal", "warm"], ["interior", "design", "architecture", "home"], "light", ["#f0e6dc", "#f8f1e9", "#2c211b", "#8a7466", "#dcc9b8"], ["#b4553a", "#5e6b58", "#d6a77a"], ["Instrument Serif", [400]], ["Work Sans", [400, 500]], "ge", "sm", "terracotta, plaster, soft shadow at 4pm"],
  ["signal-orange", "Signal Orange", "Industrial design and hardware", ["bold", "technical"], ["hardware", "industrial", "iot", "devices"], "light", ["#f1f1ee", "#ffffff", "#131313", "#62625e", "#d3d3cd"], ["#ff5b04", "#131313", "#0e7c86"], ["Chivo", [700, 800]], ["Chivo", [400, 500]], "cd", "cr", "safety orange, spec sheets, die-cast"],
  ["quiet-hours", "Quiet Hours", "Focus and deep-work tools", ["calm", "minimal"], ["productivity", "focus", "tools", "writing"], "dark", ["#121411", "#1a1d18", "#e9ece4", "#8a9282", "#2a2f27"], ["#b7c98a", "#e3b778", "#9fb8a6"], ["Newsreader", [500, 600]], ["Public Sans", [400, 500]], "sa", "sm", "dim lamp, moss, one task at a time"],
  ["pixel-playground", "Pixel Playground", "Indie game studios and tools", ["playful", "bold"], ["gaming", "indie", "tools", "game dev"], "light", ["#fdf6e3", "#ffffff", "#232130", "#6b6880", "#e6dcc0"], ["#ef476f", "#06d6a0", "#ffd166"], ["Gabarito", [600, 800]], ["Figtree", [400, 500]], "bc", "bo", "sprites, jam week, chunky shadows"],
];

export const DESIGN_PRESETS: readonly DesignPreset[] = ROWS.map(
  ([id, name, inspiredBy, moods, industries, mode, pal, brand, head, body, sp, mo, personality]): DesignPreset => {
    const [background, surface, text, muted, border] = pal;
    const [primary, secondary, accent] = brand;
    const lighter = luminance(background) >= luminance(text) ? background : text;
    const darker = lighter === background ? text : background;
    const neutral = Array.from({ length: 10 }, (_, i) => mix(lighter, darker, i / 9));
    const colors: ColorSystem = {
      baseHue: hueOf(primary),
      harmony: "preset",
      mode,
      background,
      surface,
      text,
      muted: ensureContrast(muted, background, text, 4.5),
      border,
      primary,
      onPrimary: readableOn(primary),
      secondary,
      accent,
      neutral,
      success: mode === "dark" ? "#3ddc84" : "#1f8a4c",
      warning: mode === "dark" ? "#f5b83d" : "#b7791f",
      danger: mode === "dark" ? "#ff6b6b" : "#c53030",
    };
    return {
      id,
      name,
      inspiredBy,
      moods,
      industries,
      colors,
      typography: { name: `${name} Type`, heading: face(head), body: face(body), personality },
      spacing: spacingByKey(sp),
      motion: motionByKey(mo),
    };
  }
);

function hueOf(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return Math.round((h * 60 + 360) % 360);
}
