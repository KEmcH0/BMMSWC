import fs from "fs";
import path from "path";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import HomeGallerySection from "./HomeGallerySection";

export default function Home() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  const galleryImages = fs.existsSync(galleryDir)
    ? fs
        .readdirSync(galleryDir)
        .filter((fileName) => /\.(jpe?g|png|webp|gif|avif)$/i.test(fileName))
        .map((fileName) => `/gallery/${fileName}`)
    : [];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-secondary font-bold tracking-wider">EST. 2000</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
            Bangladesh Manipuri Muslim <br className="hidden md:block" />
            <span className="text-secondary">Student Welfare Community</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10">
            Empowering students, preserving heritage, and building a stronger community through education, unity, and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/about"
              className="px-8 py-3 bg-secondary text-primary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
            >
              Learn More <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all text-center"
            >
              Join Us
            </Link>
          </div>
        </div>
      </section>


      <HomeGallerySection galleryImages={galleryImages} />
    </div>
  );
}
