import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RootDocument from "@/components/RootDocument";
import { LANGS, dict, getLang, isLang, type LangParams } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const t = dict[await getLang(params)];
  return {
    metadataBase: new URL(siteUrl),
    title: t.siteTitle,
    description: t.siteDescription,
    openGraph: {
      siteName: "BMMSWC",
      type: "website",
      images: ["/news/images/program2025.jpg"],
    },
  };
}

export default async function PublicLayout({ children, params }: { children: React.ReactNode; params: LangParams }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <RootDocument lang={lang} languageSwitch>
      {children}
    </RootDocument>
  );
}
