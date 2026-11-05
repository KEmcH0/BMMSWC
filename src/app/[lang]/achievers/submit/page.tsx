import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { dict, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import SubmitForm from "./SubmitForm";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/achievers/submit", dict[lang].submit.metaTitle, dict[lang].submit.metaDescription);
}

export default async function SubmitAchiever({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = dict[lang].submit;

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.text} />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <SubmitForm lang={lang} />
      </div>
    </>
  );
}
