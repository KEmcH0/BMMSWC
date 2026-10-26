import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsItem } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex flex-col bg-card border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
      <div className="aspect-[16/10] bg-muted relative overflow-hidden">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <span className="absolute top-4 left-4 bg-card/95 text-primary dark:text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          {item.category}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" /> {formatDate(item.date)}
        </div>
        <h3 className="text-xl font-bold leading-snug mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">{item.body}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-secondary">
          Read more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
