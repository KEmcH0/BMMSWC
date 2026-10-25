import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import NewsCard from "@/components/NewsCard";
import { formatDate, getNewsBySlug, newsItems } from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.title} | BMMSWC`,
    description: item.desc,
    openGraph: {
      title: item.title,
      description: item.desc,
      images: [item.img],
      type: "article",
    },
  };
}

export default async function NewsDetail({ params }: Props) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();

  const more = newsItems.filter((n) => n.slug !== item.slug).slice(0, 3);

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/news" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> All News & Events
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          <span className="bg-primary text-white font-bold px-3 py-1 rounded-full">{item.category}</span>
          <span className="text-secondary font-medium flex items-center">
            <Calendar className="w-4 h-4 mr-2" /> {formatDate(item.date)}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 leading-tight">{item.title}</h1>

        <div className="rounded-2xl overflow-hidden mb-8 bg-muted">
          <img src={item.img} alt={item.title} className="w-full h-auto" />
        </div>

        <p className="text-lg leading-relaxed opacity-90 whitespace-pre-line">{item.desc}</p>
      </div>

      {more.length > 0 && (
        <section className="max-w-6xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-primary mb-8">More News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {more.map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
