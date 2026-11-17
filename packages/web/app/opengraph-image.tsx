import { ImageResponse } from "next/og";
import { loadGoogleFont } from "../lib/ogFont";

const B_GLYPH =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 12 28 40" fill="none" stroke-width="6"><path d="M21 12V52" stroke="#f3ece2"/><path d="M21 15H30A7 7 0 0 1 30 29" stroke="#f3ece2"/><path d="M21 29H33A10 10 0 0 1 33 49H21" stroke="#e0a085"/></svg>'
  );

export const alt = "Baroxy: Design DNA for AI-coded apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [serif, sans] = await Promise.all([
    loadGoogleFont("Fraunces", 600),
    loadGoogleFont("Plus Jakarta Sans", 700),
  ]);
  const serifName = serif ? "Fraunces" : "serif";
  const sansName = sans ? "Plus Jakarta Sans" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#170f13",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -200,
            width: 640,
            height: 640,
            borderRadius: 640,
            background: "radial-gradient(circle, rgba(139,44,82,0.55), rgba(23,15,19,0))",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", fontFamily: serifName, fontSize: 84, color: "#f3ece2", letterSpacing: -2 }}>
          <img src={B_GLYPH} width={56} height={80} alt="" style={{ marginRight: -2 }} />
          <span>aro</span>
          <span style={{ color: "#e0a085" }}>x</span>
          <span>y</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: sansName,
              fontWeight: 700,
              fontSize: 64,
              lineHeight: 1.08,
              color: "#f3ece2",
              maxWidth: 1040,
              letterSpacing: -1.5,
            }}
          >
            Design DNA for AI-coded apps
          </div>
          <div style={{ display: "flex", fontFamily: sansName, fontSize: 28, color: "#b9a9a4", marginTop: 24, maxWidth: 900 }}>
            A locked typography, color, spacing and motion identity, so your app stops looking like the last one.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        ...(serif ? [{ name: "Fraunces", data: serif, weight: 600 as const, style: "normal" as const }] : []),
        ...(sans ? [{ name: "Plus Jakarta Sans", data: sans, weight: 700 as const, style: "normal" as const }] : []),
      ],
    }
  );
}
