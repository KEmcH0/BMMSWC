import type { Metadata } from "next";
import { getPeople } from "@/lib/db";
import { dict, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import AlumniView from "./AlumniView";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/alumni", dict[lang].alumni.metaTitle, dict[lang].alumni.metaDescription);
}

export default async function Alumni({ params }: { params: LangParams }) {
  return <AlumniView alumni={await getPeople("alumni")} lang={await getLang(params)} />;
}
