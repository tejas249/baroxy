import { ImageResponse } from "next/og";
import { loadGoogleFont } from "../lib/ogFont";

const LOGO_TILE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#6b1d3a"/><g fill="none" stroke-width="6" transform="translate(32 32) scale(1.12) translate(-32 -32)"><path d="M21 12V52" stroke="#f3ece2"/><path d="M21 15H30A7 7 0 0 1 30 29" stroke="#f3ece2"/><path d="M21 29H33A10 10 0 0 1 33 49H21" stroke="#e0a085"/></g></svg>'
  );

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await loadGoogleFont("Plus Jakarta Sans", 700);
  const headingFont = font ? "Plus Jakarta Sans" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fbf8f3",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <img src={LOGO_TILE} width={56} height={56} alt="" />
          <div style={{ display: "flex", fontSize: 40, color: "#120b0e", fontWeight: 700, fontFamily: headingFont }}>
            baroxy
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            color: "#120b0e",
            fontWeight: 700,
            maxWidth: 900,
            fontFamily: headingFont,
          }}
        >
          Design DNA for AI-coded apps
        </div>
        <div style={{ display: "flex", fontSize: 27, color: "#5e5256", marginTop: 28, maxWidth: 880 }}>
          A locked typography, color, spacing, and motion identity, so your app stops looking like the last one.
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Plus Jakarta Sans", data: font, weight: 700, style: "normal" }] : undefined }
  );
}
