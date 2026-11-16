import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0b0d0c",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: "#ffde59", borderRadius: 999, display: "flex" }} />
          <div style={{ display: "flex", fontSize: 44, color: "#f5f3ef", fontWeight: 700 }}>[baroxy]</div>
        </div>
        <div style={{ display: "flex", fontSize: 56, color: "#f5f3ef", fontWeight: 700, maxWidth: 900 }}>
          Design DNA for AI-coded apps
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9a958c", marginTop: 24, maxWidth: 900 }}>
          A locked typography, color, spacing, and motion identity — so your app stops looking like the last one.
        </div>
      </div>
    ),
    { ...size }
  );
}
