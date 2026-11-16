import { ImageResponse } from "next/og";
import { loadFrauncesFont } from "../lib/ogFont";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fraunces = await loadFrauncesFont();
  const headingFont = fraunces ? "Fraunces" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0e0c09",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, background: "#ffde59", borderRadius: 999, display: "flex" }} />
          <div style={{ display: "flex", fontSize: 40, color: "#f2ece0", fontWeight: 600, fontFamily: headingFont }}>
            [baroxy]
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 58, color: "#f2ece0", fontWeight: 600, maxWidth: 900, fontFamily: headingFont }}>
          Design DNA for AI-coded apps
        </div>
        <div style={{ display: "flex", fontSize: 27, color: "#ab9f87", marginTop: 28, maxWidth: 880 }}>
          A locked typography, color, spacing, and motion identity — so your app stops looking like the last one.
        </div>
      </div>
    ),
    { ...size, fonts: fraunces ? [{ name: "Fraunces", data: fraunces, weight: 600, style: "normal" }] : undefined }
  );
}
