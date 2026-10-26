import type { MetadataRoute } from "next";
import { getExams, getNews } from "@/lib/db";
import { siteUrl as base } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/committee", "/advisors", "/alumni", "/news", "/results", "/gallery", "/contact"];
  const [news, exams] = await Promise.all([getNews(), getExams()]);
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: n.date })),
    ...exams.map((e) => ({ url: `${base}/results/${e.slug}` })),
  ];
}
