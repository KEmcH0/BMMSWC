import type { Metadata } from "next";
import { getPeople } from "@/lib/db";
import { dict, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import CommitteeView from "./CommitteeView";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/committee", dict[lang].committee.metaTitle, dict[lang].committee.metaDescription);
}

export default async function Committee({ params }: { params: LangParams }) {
  return <CommitteeView members={await getPeople("committee")} lang={await getLang(params)} />;
}
