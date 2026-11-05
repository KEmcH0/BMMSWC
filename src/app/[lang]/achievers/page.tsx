import type { Metadata } from "next";
import { getAchievers } from "@/lib/db";
import { dict, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import AchieversView from "./AchieversView";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/achievers", dict[lang].achievers.metaTitle, dict[lang].achievers.metaDescription);
}

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function Achievers({ params }: { params: LangParams }) {
  return <AchieversView achievers={await getAchievers()} lang={await getLang(params)} />;
}
