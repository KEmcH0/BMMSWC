"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function shuffleItems<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function HomeGallerySection({ galleryImages }: { galleryImages: string[] }) {
  const [cards, setCards] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (!galleryImages.length) return;

    const initialCards = shuffleItems(galleryImages).slice(0, 3);
    setCards(initialCards);

    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const updateCards = () => {
      setIsShuffling(true);

      timeoutId = window.setTimeout(() => {
        setCards(shuffleItems(galleryImages).slice(0, 3));
        window.setTimeout(() => setIsShuffling(false), 150);
      }, 180);
    };

    updateCards();
    // eslint-disable-next-line prefer-const
    intervalId = window.setInterval(updateCards, 3500);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [galleryImages]);

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
          <AnimatePresence mode="popLayout">
            {cards.map((image, index) => (
              <motion.article
                key={`${image}-${index}`}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isShuffling ? 1.02 : 1,
                  rotate: isShuffling ? (index % 2 === 0 ? -0.5 : 0.5) : 0,
                }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
                className="gallery-card bg-background rounded-3xl border border-primary/10 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.45)] overflow-hidden group hover:-translate-y-1 transition-all duration-500 will-change-transform"
              >
                <Link href="/gallery" className="block">
                  <div className="gallery-photo-wrap aspect-[4/3] bg-primary/10 relative overflow-hidden">
                    <motion.img
                      src={image}
                      alt="Community photo preview"
                      loading="lazy"
                      decoding="async"
                      initial={{ scale: 1.03, filter: "blur(2px)" }}
                      animate={{
                        scale: isShuffling ? 1.04 : 1,
                        filter: isShuffling ? "blur(1px) saturate(0.98)" : "blur(0px)",
                      }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="gallery-photo w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
