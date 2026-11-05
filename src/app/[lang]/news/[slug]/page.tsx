import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Images } from "lucide-react";
import LinkedText from "@/components/LinkedText";
import NewsCard from "@/components/NewsCard";
import { getAlbumForNews, getAlbumPhotos, getNews, getNewsBySlug } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { dict, digits, getLang, localePath, newsBody, newsCategoryLabel, newsTitle, pageMetaAlternates } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

// Each page is built on its first visit and then cached (nothing is pre-built at deploy time).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang(params);
  const item = await getNewsBySlug(slug);
  if (!item) return {};
  const title = newsTitle(item, lang);
  const description = newsBody(item, lang).slice(0, 200);
  return {
    title: `${title} | BMMSWC`,
    description,
    alternates: pageMetaAlternates(lang, `/news/${slug}`),
    openGraph: {
      title,
      description,
      images: item.image_url ? [item.image_url] : undefined,
      type: "article",
    },
  };
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;
  const lang = await getLang(params);
  const t = dict[lang].news;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const [latest, album] = await Promise.all([getNews({ limit: 4 }), getAlbumForNews(item.id)]);
  const more = latest.filter((n) => n.id !== item.id).slice(0, 3);
  const albumPhotos = album ? await getAlbumPhotos(album.id) : [];

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href={localePath(lang, "/news")} className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> {t.allNews}
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          <span className="bg-primary text-white font-bold px-3 py-1 rounded-full">{newsCategoryLabel(item.category, lang)}</span>
          <span className="text-secondary font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-2" /> {formatDate(item.date, lang)}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-8 leading-tight">{newsTitle(item, lang)}</h1>

        {item.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 bg-muted">
            <Image src={item.image_url} alt={newsTitle(item, lang)} width={1200} height={800} sizes="(min-width: 768px) 768px, 100vw" className="w-full h-auto" priority />
          </div>
        )}

        <div className="space-y-4 text-lg leading-relaxed opacity-90">
          {newsBody(item, lang).split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="whitespace-pre-line"><LinkedText text={para} /></p>
          ))}
        </div>

        {album && albumPhotos.length > 0 && (
          <Link href={localePath(lang, `/gallery/${album.slug}`)} className="group mt-12 block bg-card border rounded-2xl p-5 hover:shadow-lg hover:border-secondary/50 transition-all">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="font-display text-xl font-semibold text-primary dark:text-white flex items-center gap-2">
                <Images className="w-5 h-5 text-secondary" /> {t.albumPhotos}
              </h2>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-white group-hover:gap-2.5 transition-all shrink-0">
                {t.photoCount(digits(albumPhotos.length, lang))} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {albumPhotos.slice(0, 4).map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image src={p.image_url} alt={p.caption || album.title} fill sizes="(min-width: 768px) 180px, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </Link>
        )}
      </div>

      {more.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">{t.more}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {more.map((n) => (
              <NewsCard key={n.id} item={n} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
