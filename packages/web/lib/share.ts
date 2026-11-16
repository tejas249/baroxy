import { randomBytes } from "node:crypto";
import { put, list } from "@vercel/blob";
import type { DesignDNA } from "@baroxy/core";

export interface ShareRecord {
  id: string;
  dna: DesignDNA;
  markdown: string;
  css: string;
  tailwind: string;
  createdAt: string;
  /** Opt-in: when true, a small pointer is also written so this shows up in the public showcase. */
  public: boolean;
}

export interface GalleryEntry {
  id: string;
  name: string;
  industry: string;
  mood: string[];
  typography: string;
  colors: { primary: string; secondary: string; accent: string };
  createdAt: string;
}

function pathFor(id: string): string {
  return `dna/${id}.json`;
}

function galleryPathFor(id: string): string {
  return `gallery/${id}.json`;
}

export function generateShareId(): string {
  return randomBytes(6).toString("base64url");
}

export async function saveShare(record: ShareRecord): Promise<void> {
  await put(pathFor(record.id), JSON.stringify(record), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  if (!record.public) return;

  // A small pointer, not the full record — keeps gallery listing cheap regardless of how big
  // the main share record grows.
  const entry: GalleryEntry = {
    id: record.id,
    name: record.dna.brief.name,
    industry: record.dna.brief.industry,
    mood: record.dna.brief.mood,
    typography: record.dna.typography.name,
    colors: { primary: record.dna.colors.primary, secondary: record.dna.colors.secondary, accent: record.dna.colors.accent },
    createdAt: record.createdAt,
  };

  await put(galleryPathFor(record.id), JSON.stringify(entry), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });
}

export async function listGallery(limit = 24): Promise<GalleryEntry[]> {
  // Vercel Blob's list() caps at 1000 per call — plenty of headroom for this stage; revisit
  // with cursor-based pagination if the showcase ever grows past that.
  const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
  const sorted = [...blobs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const entries = await Promise.all(
    sorted.slice(0, limit).map(async (blob) => {
      const res = await fetch(blob.url, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as GalleryEntry;
    })
  );

  return entries.filter((e): e is GalleryEntry => e !== null);
}

export async function loadShare(id: string): Promise<ShareRecord | null> {
  if (!/^[A-Za-z0-9_-]{6,32}$/.test(id)) return null;

  const { blobs } = await list({ prefix: pathFor(id), limit: 1 });
  if (blobs.length === 0) return null;

  const res = await fetch(blobs[0].url, { cache: "no-store" });
  if (!res.ok) return null;

  return (await res.json()) as ShareRecord;
}
