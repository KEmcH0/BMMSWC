import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate, type NewsItem } from "@/lib/news";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border group flex flex-col"
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
        <p className="opacity-80 mb-6 line-clamp-3 text-sm">{item.desc}</p>
        <span className="mt-auto text-primary font-semibold text-sm flex items-center gap-1">
          Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
