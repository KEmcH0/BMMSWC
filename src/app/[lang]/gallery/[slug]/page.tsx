import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Images } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PhotoGallery from "@/components/PhotoGallery";
import { getAlbumBySlug, getAlbumPhotos, getNews } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { dict, digits, getLang, localePath, pageMetaAlternates } from "@/lib/i18n";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

// Each page is built on its first visit and then cached (nothing is pre-built at deploy time).
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang(params);
  const t = dict[lang].gallery;
  const album = await getAlbumBySlug(slug);
  if (!album) return {};
  const photos = await getAlbumPhotos(album.id);
  const image = album.cover_url || photos[0]?.image_url;
  const description = album.description || t.albumMetaDescription(digits(photos.length, lang), album.title);
  return {
    title: `${album.title} | ${t.albumMetaSuffix}`,
    description,
    alternates: pageMetaAlternates(lang, `/gallery/${slug}`),
    openGraph: { title: album.title, description, images: image ? [image] : undefined },
  };
}

export default async function AlbumPage({ params }: Props) {
  const lang = await getLang(params);
  const t = dict[lang].gallery;
  const album = await getAlbumBySlug((await params).slug);
  if (!album) notFound();
  const [photos, news] = await Promise.all([
    getAlbumPhotos(album.id),
    album.news_id ? getNews() : Promise.resolve([]),
  ]);
  const related = news.find((n) => n.id === album.news_id);

  return (
    <>
      <PageHeader eyebrow={t.albumEyebrow} title={album.title} description={album.description || undefined}>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
          {album.event_date && (
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" /> {formatDate(album.event_date, lang)}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Images className="w-4 h-4 text-secondary" /> {t.photos(digits(photos.length, lang))}
          </span>
          {related && (
            <Link href={localePath(lang, `/news/${related.slug}`)} className="flex items-center gap-2 font-semibold text-secondary hover:gap-3 transition-all">
              {t.readNews} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-12">
        <Link href={localePath(lang, "/gallery")} className="inline-flex items-center gap-2 text-primary dark:text-white hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> {t.allAlbums}
        </Link>
        {photos.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{t.photosSoon}</p>
        ) : (
          <PhotoGallery
            title={album.title}
            lang={lang}
            photos={photos.map((p) => ({ id: p.id, url: p.image_url, caption: p.caption, width: p.width, height: p.height }))}
          />
        )}
      </div>
    </>
  );
}
