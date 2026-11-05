import type { Metadata } from "next";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/db";
import { todayInDhaka } from "@/lib/format";
import { dict, getLang, pageMeta, type LangParams } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/news", dict[lang].news.metaTitle, dict[lang].news.metaDescription);
}

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function News({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = dict[lang].news;
  const newsItems = await getNews();
  const today = todayInDhaka();
  const upcoming = newsItems.filter((n) => n.date >= today).reverse();
  const past = newsItems.filter((n) => n.date < today);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.text} />
      <div className="container mx-auto px-4 py-16">
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">{t.upcoming}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((item) => (
                <NewsCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {newsItems.length === 0 && <p className="text-center opacity-70">{t.none}</p>}

        <section>
          {upcoming.length > 0 && <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">{t.past}</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {past.map((item) => (
              <NewsCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
