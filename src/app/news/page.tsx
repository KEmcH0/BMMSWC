import type { Metadata } from "next";
import NewsCard from "@/components/NewsCard";
import { newsItems } from "@/lib/news";

export const metadata: Metadata = {
  title: "News & Events | BMMSWC",
  description: "Latest news, programs and events of BMMSWC.",
};

export default function News() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">News & Events</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">
          Stay updated with the latest happenings and upcoming events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
