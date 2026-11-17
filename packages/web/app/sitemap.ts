import type { MetadataRoute } from "next";
import { listGallery } from "../lib/share";

import { SITE_URL as BASE_URL } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/generate`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/presets`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/showcase`, changeFrequency: "daily", priority: 0.6 },
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
