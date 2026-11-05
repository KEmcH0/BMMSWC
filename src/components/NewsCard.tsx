import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsItem } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { dict, localePath, newsBody, newsCategoryLabel, newsTitle, type Lang } from "@/lib/i18n";

export default function NewsCard({ item, lang }: { item: NewsItem; lang: Lang }) {
  return (
    <Link
      href={localePath(lang, `/news/${item.slug}`)}
      className="group flex flex-col bg-card border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={newsTitle(item, lang)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <span className="absolute top-4 left-4 bg-card/95 text-primary dark:text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {newsCategoryLabel(item.category, lang)}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" /> {formatDate(item.date, lang)}
        </div>
        <h3 className="text-xl font-bold leading-snug mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
          {newsTitle(item, lang)}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">{newsBody(item, lang)}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-secondary">
          {dict[lang].news.readMore} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
