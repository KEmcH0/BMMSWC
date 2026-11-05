import type { Metadata } from "next";
import { getPeople } from "@/lib/db";
import { dict, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import AdvisorsView from "./AdvisorsView";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/advisors", dict[lang].advisors.metaTitle, dict[lang].advisors.metaDescription);
}

export default async function Advisors({ params }: { params: LangParams }) {
  return <AdvisorsView advisors={await getPeople("advisor")} lang={await getLang(params)} />;
}
