import { ImageResponse } from "next/og";
import { loadShare } from "../../../lib/share";
import { loadGoogleFont } from "../../../lib/ogFont";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [record, font] = await Promise.all([loadShare(id), loadGoogleFont("Plus Jakarta Sans", 700)]);
  const headingFont = font ? "Plus Jakarta Sans" : "sans-serif";

  const name = record?.dna.brief.name ?? "Baroxy";
  const typography = record?.dna.typography.name ?? "";
  const industry = record?.dna.brief.industry ?? "";
  const primary = record?.dna.colors.primary ?? "#6b1d3a";
  const secondary = record?.dna.colors.secondary ?? "#e0a085";
  const accent = record?.dna.colors.accent ?? "#1f8a4c";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 52 }}>
          <div style={{ width: 64, height: 64, background: primary, borderRadius: 14, display: "flex" }} />
          <div style={{ width: 64, height: 64, background: secondary, borderRadius: 14, display: "flex" }} />
          <div style={{ width: 64, height: 64, background: accent, borderRadius: 14, display: "flex" }} />
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#17171a", fontFamily: headingFont }}>
          {name}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5c5c62", marginTop: 18 }}>
          {industry}
          {typography ? ` · ${typography}` : ""}
        </div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 24, color: "#b8740f" }}>
          baroxy · Design DNA
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Plus Jakarta Sans", data: font, weight: 700, style: "normal" }] : undefined }
  );
}
