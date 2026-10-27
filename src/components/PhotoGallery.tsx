"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight, Download, Share2, X } from "lucide-react";

export type Photo = { id: string; url: string; caption: string; width: number | null; height: number | null };

// Supabase serves a file as a download when "?download" is added; local files use the download attribute.
function downloadUrl(url: string) {
  return url.includes("/storage/v1/object/public/") ? `${url}?download=` : url;
}

// Keeps ?photo=<id> in the address bar so a single photo can be shared.
function setPhotoParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("photo", id);
  else url.searchParams.delete("photo");
  window.history.replaceState(null, "", url);
}

function Lightbox({
  photos,
  index,
  title,
  onChange,
  onClose,
}: {
  photos: Photo[];
  index: number;
  title: string;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const [copied, setCopied] = useState(false);
  const touchX = useRef<number | null>(null);
  const thumbs = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => index > 0 && onChange(index - 1), [index, onChange]);
  const next = useCallback(() => index < photos.length - 1 && onChange(index + 1), [index, photos.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, prev, next]);

  useEffect(() => {
    setCopied(false);
    thumbs.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      // The share sheet was closed; nothing to do.
    }
  }

  const button = "p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors";

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#05070d]" role="dialog" aria-modal="true" aria-label={title}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 p-3 md:p-4 text-white">
        <p className="text-sm font-medium tabular-nums px-2">
          {index + 1} / {photos.length}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={share} className={button} aria-label="Share photo">
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </button>
          <a href={downloadUrl(photo.url)} download className={button} aria-label="Download photo">
            <Download className="w-5 h-5" />
          </a>
          <button type="button" onClick={onClose} className={button} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      {copied && <p className="text-center text-xs text-white/70 -mt-2">Link copied</p>}

      {/* Photo; swipe left/right on phones */}
      <div
        className="relative flex-1 min-h-0 mx-2 md:mx-16"
        onClick={onClose}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50) prev();
          if (dx < -50) next();
          touchX.current = null;
        }}
      >
        <Image
          key={photo.id}
          src={photo.url}
          alt={photo.caption || title}
          fill
          sizes="100vw"
          priority
          className="object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {index > 0 && (
        <button type="button" onClick={prev} className={`${button} hidden md:block absolute left-4 top-1/2 -translate-y-1/2`} aria-label="Previous photo">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {index < photos.length - 1 && (
        <button type="button" onClick={next} className={`${button} hidden md:block absolute right-4 top-1/2 -translate-y-1/2`} aria-label="Next photo">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Caption and thumbnails */}
      <div className="p-3 md:p-4 space-y-3">
        {photo.caption && <p className="text-center text-white/90 text-sm md:text-base">{photo.caption}</p>}
        {photos.length > 1 && (
          <div ref={thumbs} className="flex gap-2 overflow-x-auto justify-start md:justify-center pb-1 [scrollbar-width:none]">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                data-index={i}
                onClick={() => onChange(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md transition-all ${
                  i === index ? "ring-2 ring-secondary opacity-100" : "opacity-50 hover:opacity-80"
                }`}
                aria-label={`Photo ${i + 1}`}
              >
                <Image src={p.url} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Masonry grid: every photo keeps its own shape, nothing is cropped.
export default function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  // A shared link (?photo=<id>) opens that photo. Read in the browser so the page itself can be cached.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("photo");
    const i = photos.findIndex((p) => p.id === id);
    if (i >= 0) setOpen(i);
  }, [photos]);

  const show = useCallback(
    (i: number | null) => {
      setOpen(i);
      setPhotoParam(i === null ? null : photos[i].id);
    },
    [photos]
  );
  const close = useCallback(() => show(null), [show]);

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => show(i)}
            className="group relative mb-3 md:mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            style={{ aspectRatio: p.width && p.height ? `${p.width} / ${p.height}` : undefined }}
            aria-label={p.caption || `Open photo ${i + 1}`}
          >
            <Image
              src={p.url}
              alt={p.caption || `${title} photo ${i + 1}`}
              width={p.width ?? 1200}
              height={p.height ?? 900}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {p.caption && (
              <p className="absolute bottom-0 inset-x-0 p-3 text-left text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                {p.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {open !== null && photos[open] && (
        <Lightbox photos={photos} index={open} title={title} onChange={show} onClose={close} />
      )}
    </>
  );
}
