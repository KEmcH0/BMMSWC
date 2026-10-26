import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

// Mosaic of the latest photos: one large tile and up to four small ones.
export default function HomeGallerySection({ images }: { images: { url: string; caption: string; href: string }[] }) {
  if (!images.length) return null;
  const [first, ...rest] = images.slice(0, 5);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <SectionHeading eyebrow="Gallery" title="Moments from our programs" />
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 font-semibold text-primary dark:text-white hover:gap-3 transition-all shrink-0"
          >
            View gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:h-[520px]">
          {[first, ...rest].map((img, i) => (
            <Link
              key={img.url}
              href={img.href}
              className={`group relative overflow-hidden rounded-2xl bg-muted ${
                i === 0 ? "col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto" : "aspect-square lg:aspect-auto"
              }`}
            >
              <Image
                src={img.url}
                alt={img.caption || "BMMSWC program photo"}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
