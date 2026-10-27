import type { MetadataRoute } from "next";
import { getAlbums, getExams, getNews } from "@/lib/db";
import { siteUrl as base } from "@/lib/site";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/committee", "/advisors", "/news", "/results", "/gallery", "/contact"];
  const [news, exams, albums] = await Promise.all([getNews(), getExams(), getAlbums()]);
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: n.date })),
    ...exams.map((e) => ({ url: `${base}/results/${e.slug}` })),
    ...albums.map((a) => ({ url: `${base}/gallery/${a.slug}` })),
  ];
}
