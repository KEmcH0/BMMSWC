import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Eye, Target } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import { dict, digits, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/about", dict[lang].about.metaTitle, dict[lang].about.metaDescription);
}

export default async function About({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = dict[lang].about;
  const founded = digits(site.founded, lang);

  return (
    <>
      <PageHeader eyebrow={t.since(founded)} title={t.title} description={dict[lang].orgName} />

      {/* History */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHeading eyebrow={t.historyEyebrow} title={t.historyTitle} />
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {t.historyText(founded)}
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/news/images/seminar.jpeg"
              alt={t.historyImageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="py-20 bg-muted/60">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Target,
              title: t.mission,
              text: t.missionText,
            },
            {
              icon: Eye,
              title: t.vision,
              text: t.visionText,
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-card border rounded-2xl p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mb-6">
                <Icon className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-primary dark:text-white mb-3">{title}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading align="center" eyebrow={t.guidesEyebrow} title={t.guidesTitle} />
          <ul className="mt-12 grid sm:grid-cols-2 gap-4">
            {t.objectives.map((o) => (
              <li key={o} className="flex items-start gap-3 bg-card border rounded-xl p-5">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
