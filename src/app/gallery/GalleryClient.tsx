"use client";

import { useState } from "react";
import { X } from "lucide-react";

type GalleryImage = {
  id: number;
  url: string;
  alt: string;
};

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Photo Gallery</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">
          Capturing the beautiful moments of our community events.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="aspect-square bg-muted rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => setSelectedImg(img.url)}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {selectedImg && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 text-white hover:text-secondary bg-black/50 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImg}
            alt="Expanded gallery view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
