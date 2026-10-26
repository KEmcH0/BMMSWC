"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { GalleryCard } from "@/components/GalleryCard";
import { Lightbox } from "@/components/Lightbox";
import { GalleryImage } from "@/lib/galleryData";

interface GalleryProps {
  images: GalleryImage[];
}

const ITEMS_PER_PAGE = 12;

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter images based on search only
  const filteredImages = images.filter((img) => {
    const matchesSearch =
      !searchQuery ||
      img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.alt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Get currently displayed images
  const displayedImages = filteredImages.slice(0, displayedCount);
  const hasMore = displayedCount < filteredImages.length;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          // Simulate loading delay
          setTimeout(() => {
            setDisplayedCount((prev) =>
              Math.min(prev + ITEMS_PER_PAGE, filteredImages.length)
            );
            setIsLoading(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, filteredImages.length]);

  // Reset pagination when search changes
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  const handlePrevImage = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id
    );
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  }, [selectedImage, filteredImages]);

  const handleNextImage = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id
    );
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  }, [selectedImage, filteredImages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative min-h-screen">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-10 pb-8 px-4"
      >
        <div className="container mx-auto max-w-7xl">

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  aria-label="Search gallery"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Results count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground"
            >
              Showing {displayedImages.length} of {filteredImages.length} photos
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-7xl">
          {filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <p className="text-lg text-muted-foreground">
                No photos found. Try adjusting your search or filters.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-max"
              >
                <AnimatePresence mode="popLayout">
                  {displayedImages.map((image, index) => (
                    <GalleryCard
                      key={image.id}
                      image={image}
                      index={index}
                      onClick={setSelectedImage}
                      isLoading={false}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Infinite scroll trigger */}
              <div
                ref={observerTarget}
                className="mt-12 flex justify-center"
                aria-live="polite"
                aria-label={`Loading more photos... ${displayedCount} of ${filteredImages.length}`}
              >
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="w-3 h-3 rounded-full bg-secondary"
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {!hasMore && displayedImages.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-12 text-sm text-muted-foreground"
                >
                  You&apos;ve reached the end of the gallery
                </motion.p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        image={selectedImage}
        allImages={filteredImages}
        onClose={() => setSelectedImage(null)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </div>
  );
}
