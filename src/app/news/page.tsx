import type { Metadata } from "next";
import NewsCard from "@/components/NewsCard";
import { getNews } from "@/lib/db";
import { todayInDhaka } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "News & Events | BMMSWC",
  description: "Latest news, programs and events of BMMSWC.",
};

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function News() {
  const newsItems = await getNews();
  const today = todayInDhaka();
  const upcoming = newsItems.filter((n) => n.date >= today).reverse();
  const past = newsItems.filter((n) => n.date < today);

  return (
    <>
      <PageHeader eyebrow="Stay Updated" title="News & Events" description="The latest happenings, programs and upcoming events." />
      <div className="container mx-auto px-4 py-16">
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcoming.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {newsItems.length === 0 && <p className="text-center opacity-70">No news yet.</p>}

        <section>
          {upcoming.length > 0 && <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">Past News & Events</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {past.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
