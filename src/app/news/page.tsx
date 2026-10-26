import type { Metadata } from "next";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/db";
import { todayInDhaka } from "@/lib/format";

export const metadata: Metadata = {
  title: "News & Events | BMMSWC",
  description: "Latest news, programs and events of BMMSWC.",
};

export const dynamic = "force-dynamic";

export default async function News() {
  const newsItems = await getNews();
  const today = todayInDhaka();
  const upcoming = newsItems.filter((n) => n.date >= today).reverse();
  const past = newsItems.filter((n) => n.date < today);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">News & Events</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">
          Stay updated with the latest happenings and upcoming events.
        </p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {newsItems.length === 0 && <p className="text-center opacity-70">No news yet.</p>}

      <section>
        {upcoming.length > 0 && <h2 className="text-2xl font-bold text-primary mb-8">Past News & Events</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {past.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
