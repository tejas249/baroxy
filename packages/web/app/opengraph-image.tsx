import { ImageResponse } from "next/og";
import { loadGoogleFont } from "../lib/ogFont";

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
          background: "#ffffff",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, background: "#ffde59", borderRadius: 999, display: "flex" }} />
          <div style={{ display: "flex", fontSize: 40, color: "#17171a", fontWeight: 700, fontFamily: headingFont }}>
            [baroxy]
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            color: "#17171a",
            fontWeight: 700,
            maxWidth: 900,
            fontFamily: headingFont,
          }}
        >
          Design DNA for AI-coded apps
        </div>
        <div style={{ display: "flex", fontSize: 27, color: "#5c5c62", marginTop: 28, maxWidth: 880 }}>
          A locked typography, color, spacing, and motion identity — so your app stops looking like the last one.
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Plus Jakarta Sans", data: font, weight: 700, style: "normal" }] : undefined }
  );
}
