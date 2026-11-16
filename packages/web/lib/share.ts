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
}

function pathFor(id: string): string {
  return `dna/${id}.json`;
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
}

export async function loadShare(id: string): Promise<ShareRecord | null> {
  if (!/^[A-Za-z0-9_-]{6,32}$/.test(id)) return null;

  const { blobs } = await list({ prefix: pathFor(id), limit: 1 });
  if (blobs.length === 0) return null;

  const res = await fetch(blobs[0].url, { cache: "no-store" });
  if (!res.ok) return null;

  return (await res.json()) as ShareRecord;
}
