import { ImageResponse } from "next/og";
import { loadShare } from "../../../lib/share";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await loadShare(id);

  const name = record?.dna.brief.name ?? "Baroxy";
  const typography = record?.dna.typography.name ?? "";
  const industry = record?.dna.brief.industry ?? "";
  const primary = record?.dna.colors.primary ?? "#ffde59";
  const secondary = record?.dna.colors.secondary ?? "#d9d4c8";
  const accent = record?.dna.colors.accent ?? "#f5f3ef";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b0d0c",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
          <div style={{ width: 72, height: 72, background: primary, borderRadius: 8, display: "flex" }} />
          <div style={{ width: 72, height: 72, background: secondary, borderRadius: 8, display: "flex" }} />
          <div style={{ width: 72, height: 72, background: accent, borderRadius: 8, display: "flex" }} />
        </div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#f5f3ef" }}>{name}</div>
        <div style={{ display: "flex", fontSize: 30, color: "#9a958c", marginTop: 16 }}>
          {industry}
          {typography ? ` · ${typography}` : ""}
        </div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 26, color: "#ffde59" }}>
          [baroxy] — Design DNA
        </div>
      </div>
    ),
    { ...size }
  );
}
