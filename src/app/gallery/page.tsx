import fs from "fs";
import path from "path";

import GalleryClient from "./GalleryClient";

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  const imageFiles = fs.existsSync(galleryDir)
    ? fs
        .readdirSync(galleryDir)
        .filter((fileName) => /\.(jpe?g|png|webp|gif|avif)$/i.test(fileName))
        .sort((a, b) => a.localeCompare(b))
    : [];

  const images = imageFiles.map((fileName, index) => ({
    id: index + 1,
    url: `/gallery/${fileName}`,
    alt: `BMMSWC gallery photo ${index + 1}`,
  }));

  return <GalleryClient images={images} />;
}
