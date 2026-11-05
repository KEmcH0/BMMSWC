import type { MetadataRoute } from "next";
import { getAlbums, getExams, getNews } from "@/lib/db";
import { localePath } from "@/lib/i18n";
import { siteUrl as base } from "@/lib/site";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/committee", "/advisors", "/news", "/results", "/achievers", "/achievers/submit", "/gallery", "/contact", "/developer"];
  const [news, exams, albums] = await Promise.all([getNews(), getExams(), getAlbums()]);
  const entries = [
    ...pages.map((p) => ({ path: p || "/" })),
    ...news.map((n) => ({ path: `/news/${n.slug}`, lastModified: n.date })),
    ...exams.map((e) => ({ path: `/results/${e.slug}` })),
    ...albums.map((a) => ({ path: `/gallery/${a.slug}` })),
  ];
  // Every page, in English and in Bangla.
  return entries.map(({ path, ...rest }) => ({
    url: `${base}${path === "/" ? "" : path}`,
    alternates: { languages: { en: `${base}${path === "/" ? "" : path}`, bn: `${base}${localePath("bn", path)}` } },
    ...rest,
  })).flatMap((entry) => [entry, { ...entry, url: entry.alternates.languages.bn }]);
}
