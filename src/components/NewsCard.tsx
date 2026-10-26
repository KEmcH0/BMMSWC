import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsItem } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border group flex flex-col"
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {item.image_url && <Image src={item.image_url} alt={item.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
          {item.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-sm text-secondary font-medium mb-3 flex items-center">
          <Calendar className="w-4 h-4 mr-2" /> {formatDate(item.date)}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="opacity-80 mb-6 line-clamp-3 text-sm">{item.body}</p>
        <span className="mt-auto text-primary font-semibold text-sm flex items-center gap-1">
          Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
