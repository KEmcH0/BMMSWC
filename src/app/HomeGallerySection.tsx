"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function shuffleItems<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function HomeGallerySection({ galleryImages }: { galleryImages: string[] }) {
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!galleryImages.length) return;

    let timeoutId: number | undefined;

    const updateImages = () => {
      setIsTransitioning(true);
      timeoutId = window.setTimeout(() => {
        setDisplayImages(shuffleItems(galleryImages).slice(0, 3));
        setIsTransitioning(false);
      }, 350);
    };

    updateImages();

    const interval = window.setInterval(updateImages, 2500);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearInterval(interval);
    };
  }, [galleryImages]);

  const cards = useMemo(
    () =>
      (displayImages.length ? displayImages : galleryImages.slice(0, 3)).map((image, index) => ({
        id: `${image}-${index}`,
        image,
      })),
    [displayImages, galleryImages]
  );

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">Recent Activities</h2>
            <div className="w-24 h-1 bg-secondary rounded-full" />
          </div>
          <Link
            href="/gallery"
            className="hidden md:flex items-center text-primary font-medium hover:text-secondary transition-colors"
          >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((item) => (
            <article
              key={item.id}
              className={`gallery-card bg-background rounded-3xl border border-primary/10 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] overflow-hidden group hover:-translate-y-1 transition-all duration-500 ${
                isTransitioning ? "opacity-60 scale-[0.98]" : "opacity-100 scale-100"
              }`}
            >
              <Link href="/gallery" className="block">
                <div className="gallery-photo-wrap aspect-[4/3] bg-primary/10 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt="Community photo preview"
                    className="gallery-photo w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    style={{ opacity: isTransitioning ? 0.35 : 1, transform: isTransitioning ? "scale(1.02)" : "scale(1)" }}
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
