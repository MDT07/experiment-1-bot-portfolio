import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) return [];

  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/ru`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/labs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/ru/labs`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
