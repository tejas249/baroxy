import type { MetadataRoute } from "next";
import { listGallery } from "../lib/share";
import { GUIDES } from "../lib/guides";

import { SITE_URL as BASE_URL } from "../lib/site";

// Regenerate at most hourly instead of listing Blob storage on every crawler hit.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/generate`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/showcase`, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE_URL}/guides`, changeFrequency: "weekly", priority: 0.8 },
    ...GUIDES.map((g) => ({
      url: `${BASE_URL}/guides/${g.slug}`,
      lastModified: g.published,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE_URL}/changelog`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Only entries shared with "List this publicly" are discoverable here -- unlisted share
  // links stay out of the sitemap, matching their default privacy.
  const entries = await listGallery(100).catch(() => []);
  const galleryRoutes: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${BASE_URL}/d/${entry.id}`,
    lastModified: entry.createdAt,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...galleryRoutes];
}
