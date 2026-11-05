import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Images } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getAlbums } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { dict, digits, getLang, localePath, pageMeta, type LangParams } from "@/lib/i18n";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const lang = await getLang(params);
  return pageMeta(lang, "/gallery", dict[lang].gallery.metaTitle, dict[lang].gallery.metaDescription);
}

export default async function GalleryPage({ params }: { params: LangParams }) {
  const lang = await getLang(params);
  const t = dict[lang].gallery;
  const albums = await getAlbums();

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.text}
      />
      <div className="container mx-auto px-4 py-16">
        {albums.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-muted flex items-center justify-center">
              <Images className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-primary dark:text-white">{t.soon}</h2>
            <p className="mt-2 text-muted-foreground">{t.soonText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {albums.map((a, i) => (
              <Link key={a.id} href={localePath(lang, `/gallery/${a.slug}`)} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 transition-shadow">
                  {a.cover && (
                    <Image
                      src={a.cover}
                      alt={a.title}
                      fill
                      priority={i < 3}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/10 to-transparent" />
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
                    <Images className="w-3.5 h-3.5" /> {digits(a.photo_count, lang)}
                  </span>
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    {a.event_date && (
                      <p className="flex items-center gap-1.5 text-sm text-secondary font-medium mb-1">
                        <Calendar className="w-4 h-4" /> {formatDate(a.event_date, lang)}
                      </p>
                    )}
                    <h2 className="font-display text-xl md:text-2xl font-semibold leading-snug">{a.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
