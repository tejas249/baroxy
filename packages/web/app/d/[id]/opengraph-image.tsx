import { ImageResponse } from "next/og";
import { loadShare } from "../../../lib/share";
import { loadFrauncesFont } from "../../../lib/ogFont";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [record, fraunces] = await Promise.all([loadShare(id), loadFrauncesFont()]);
  const headingFont = fraunces ? "Fraunces" : "serif";

  const name = record?.dna.brief.name ?? "Baroxy";
  const typography = record?.dna.typography.name ?? "";
  const industry = record?.dna.brief.industry ?? "";
  const primary = record?.dna.colors.primary ?? "#ffde59";
  const secondary = record?.dna.colors.secondary ?? "#ab9f87";
  const accent = record?.dna.colors.accent ?? "#f2ece0";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0e0c09",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 10, marginBottom: 52 }}>
          <div style={{ width: 64, height: 64, background: primary, display: "flex" }} />
          <div style={{ width: 64, height: 64, background: secondary, display: "flex" }} />
          <div style={{ width: 64, height: 64, background: accent, display: "flex" }} />
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 600, color: "#f2ece0", fontFamily: headingFont }}>
          {name}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#ab9f87", marginTop: 18 }}>
          {industry}
          {typography ? ` · ${typography}` : ""}
        </div>
        <div style={{ display: "flex", marginTop: "auto", fontSize: 24, color: "#ffde59" }}>
          [baroxy] — Design DNA
        </div>
      </div>
    ),
    { ...size, fonts: fraunces ? [{ name: "Fraunces", data: fraunces, weight: 600, style: "normal" }] : undefined }
  );
}
