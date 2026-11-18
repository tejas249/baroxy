import { randomBytes } from "node:crypto";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { put, list } from "@vercel/blob";
import { normalizeDesignDNA, type DesignDNA } from "@baroxy/core";

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

export async function saveShare(record: ShareRecord): Promise<{ listed: boolean }> {
  await put(pathFor(record.id), JSON.stringify(record), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  if (!record.public) return { listed: false };

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

  // The share link itself already works at this point. If only the showcase pointer fails, keep
  // the link and report it as unlisted rather than failing the whole request.
  try {
    await put(galleryPathFor(record.id), JSON.stringify(entry), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
    });
    return { listed: true };
  } catch (err) {
    console.error("share: saved record but failed to list it", { id: record.id, message: err instanceof Error ? err.message : String(err) });
    return { listed: false };
  }
}

export async function listGallery(limit = 24): Promise<GalleryEntry[]> {
  // Vercel Blob's list() caps at 1000 per call — plenty of headroom for this stage; revisit
  // with cursor-based pagination if the showcase ever grows past that.
  const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
  const sorted = [...blobs].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const entries = await Promise.all(
    sorted.slice(0, limit).map(async (blob) => {
      // Gallery pointers are immutable once written, so they can be cached between revalidations.
      const res = await fetch(blob.url, { next: { revalidate: 300 } }).catch(() => null);
      if (!res || !res.ok) return null;
      return (await res.json().catch(() => null)) as GalleryEntry | null;
    })
  );

  return entries.filter((e): e is GalleryEntry => e !== null);
}

const SHARE_ID = /^[A-Za-z0-9_-]{6,32}$/;

class ShareNotFound extends Error {}

async function fetchShare(id: string): Promise<ShareRecord> {
  // Exact path (with extension) so a short id can never prefix-match a longer one.
  const { blobs } = await list({ prefix: pathFor(id), limit: 5 });
  const blob = blobs.find((b) => b.pathname === pathFor(id));
  if (!blob) throw new ShareNotFound();

  const res = await fetch(blob.url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`share fetch failed: ${res.status}`);

  const record = (await res.json()) as ShareRecord;
  // Records saved by older core versions lack newer fields; bring them up to date so old links keep working.
  return { ...record, dna: normalizeDesignDNA(record.dna) };
}

// Share records never change once written, so a found record is cached for an hour across requests.
// Only successes are cached: a missing record or a transient storage error throws and is retried.
const fetchShareCached = unstable_cache(fetchShare, ["share-record"], { revalidate: 3600 });

/**
 * Loads a shared Design DNA, or null if it doesn't exist. Deduplicated per request (metadata, page
 * and OG image all ask for the same record) and cached across requests.
 */
export const loadShare = cache(async (id: string): Promise<ShareRecord | null> => {
  if (!SHARE_ID.test(id)) return null;
  try {
    return await fetchShareCached(id);
  } catch (err) {
    if (!(err instanceof ShareNotFound)) {
      console.error("share: load failed", { id, message: err instanceof Error ? err.message : String(err) });
    }
    return null;
  }
});
