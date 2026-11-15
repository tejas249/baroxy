import type { FontPairing } from "./types.js";

// Deliberately excludes Inter, Roboto, Open Sans, and Poppins — the four faces
// that dominate default AI-generated UI. Every pairing here has to be chosen,
// not defaulted into.
export const FONT_PAIRINGS: readonly FontPairing[] = [
  {
    name: "Editorial Serif",
    heading: {
      family: "Fraunces",
      weights: [500, 600, 900],
      googleFontUrl: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,900&display=swap",
    },
    body: { family: "Work Sans", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500&display=swap" },
    personality: "confident, editorial, a little literary",
  },
  {
    name: "Technical Mono",
    heading: { family: "Space Grotesk", weights: [500, 700], googleFontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" },
    body: { family: "IBM Plex Sans", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500&display=swap" },
    personality: "technical, precise, engineering-forward",
  },
  {
    name: "Warm Grotesk",
    heading: { family: "Bricolage Grotesque", weights: [600, 800], googleFontUrl: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&display=swap" },
    body: { family: "Public Sans", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500&display=swap" },
    personality: "warm, friendly, approachable but not cute",
  },
  {
    name: "Quiet Luxury",
    heading: { family: "Instrument Serif", weights: [400], googleFontUrl: "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap" },
    body: { family: "Red Hat Text", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;500&display=swap" },
    personality: "restrained, expensive-feeling, minimal",
  },
  {
    name: "Structured Grotesk",
    heading: { family: "Schibsted Grotesk", weights: [600, 700], googleFontUrl: "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@600;700&display=swap" },
    body: { family: "Sora", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500&display=swap" },
    personality: "clean, structured, modern Nordic feel",
  },
  {
    name: "Literary Sans",
    heading: { family: "Newsreader", weights: [500, 700], googleFontUrl: "https://fonts.googleapis.com/css2?family=Newsreader:wght@500;700&display=swap" },
    body: { family: "Source Sans 3", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500&display=swap" },
    personality: "thoughtful, long-form, trustworthy",
  },
  {
    name: "Bold Display",
    heading: { family: "Unbounded", weights: [600, 800], googleFontUrl: "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap" },
    body: { family: "Manrope", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500&display=swap" },
    personality: "loud, startup-energetic, a little brash",
  },
  {
    name: "Soft Geometric",
    heading: { family: "Lexend", weights: [500, 700], googleFontUrl: "https://fonts.googleapis.com/css2?family=Lexend:wght@500;700&display=swap" },
    body: { family: "Nunito Sans", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500&display=swap" },
    personality: "soft, rounded, consumer-friendly",
  },
  {
    name: "Mono Technical",
    heading: { family: "JetBrains Mono", weights: [500, 700], googleFontUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap" },
    body: { family: "Hanken Grotesk", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&display=swap" },
    personality: "developer-tool, terminal-native, precise",
  },
  {
    name: "Classic Slab",
    heading: { family: "Zilla Slab", weights: [500, 700], googleFontUrl: "https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@500;700&display=swap" },
    body: { family: "Karla", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Karla:wght@400;500&display=swap" },
    personality: "grounded, a little retro-editorial",
  },
  {
    name: "Sharp Condensed",
    heading: { family: "Archivo", weights: [600, 800], googleFontUrl: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&display=swap" },
    body: { family: "Archivo", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500&display=swap" },
    personality: "sharp, condensed, no-nonsense",
  },
  {
    name: "Rounded Display",
    heading: { family: "Fredoka", weights: [500, 600], googleFontUrl: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap" },
    body: { family: "Mukta", weights: [400, 500], googleFontUrl: "https://fonts.googleapis.com/css2?family=Mukta:wght@400;500&display=swap" },
    personality: "playful, rounded, consumer app energy",
  },
];
