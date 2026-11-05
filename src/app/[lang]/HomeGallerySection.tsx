"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { dict, localePath, type Lang } from "@/lib/i18n";

type Photo = { url: string; caption: string; href: string };

const TILES = 5;
const SWAP_EVERY_MS = 3000;
// The tiles change one at a time, in an order that jumps around the mosaic.
const SWAP_ORDER = [2, 0, 4, 1, 3];

// One photo of the mosaic: a new photo fades in over the old one once it has loaded.
function Tile({ photo, large, fallbackAlt }: { photo: Photo; large: boolean; fallbackAlt: string }) {
  const [shown, setShown] = useState(photo);
  const [incomingLoaded, setIncomingLoaded] = useState(false);
  const sizes = large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw";
  const imageClass = "object-cover transition-[scale,opacity] duration-700 group-hover:scale-105";

  return (
    <Link
      href={photo.href}
      className={`group relative overflow-hidden rounded-2xl bg-muted ${
        large ? "col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto" : "aspect-square lg:aspect-auto"
      }`}
    >
      <Image src={shown.url} alt={shown.caption || fallbackAlt} fill sizes={sizes} className={imageClass} />
      {photo.url !== shown.url && (
        <Image
          key={photo.url}
          src={photo.url}
          alt={photo.caption || fallbackAlt}
          fill
          sizes={sizes}
          className={`${imageClass} ${incomingLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIncomingLoaded(true)}
          onTransitionEnd={(e) => {
            if (e.propertyName !== "opacity") return;
            setShown(photo);
            setIncomingLoaded(false);
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// Mosaic of recent photos: one large tile and up to four small ones, slowly cycling through all the photos it is given.
export default function HomeGallerySection({ images, lang }: { images: Photo[]; lang: Lang }) {
  const h = dict[lang].home;
  // tiles: which photo each tile shows. step: how many swaps have happened.
  const [{ tiles }, setRotation] = useState({ tiles: images.slice(0, TILES).map((_, i) => i), step: 0 });
  const paused = useRef(false);

  useEffect(() => {
    if (images.length <= TILES || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (paused.current || document.hidden) return;
      setRotation(({ tiles, step }) => {
        const next = [...tiles];
        next[SWAP_ORDER[step % TILES]] = (TILES + step) % images.length;
        return { tiles: next, step: step + 1 };
      });
    }, SWAP_EVERY_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) return null;

  const pause = () => (paused.current = true);
  const resume = () => (paused.current = false);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <SectionHeading eyebrow={h.galleryEyebrow} title={h.galleryTitle} />
          <Link
            href={localePath(lang, "/gallery")}
            className="inline-flex items-center gap-2 font-semibold text-primary dark:text-white hover:gap-3 transition-all shrink-0"
          >
            {h.galleryLink} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Holds still while the pointer or keyboard is on a photo, so it can't change just as it is clicked. */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:h-[520px]"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
        >
          {tiles.map((photoIndex, i) => (
            <Tile key={i} photo={images[photoIndex]} large={i === 0} fallbackAlt={h.photoAlt} />
          ))}
        </div>
      </div>
    </section>
  );
}
