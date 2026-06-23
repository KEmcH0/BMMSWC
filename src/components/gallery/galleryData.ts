import { readdirSync } from "fs";
import { join } from "path";

export type GalleryItem = {
  id: number;
  src: string;
  title: string;
  category: string;
  caption: string;
  year: string;
  location: string;
};

// Metadata mapping for gallery items
const galleryMetadata: Record<
  string,
  { title: string; category: string; caption: string; year: string; location: string }
> = {
  // Add metadata for each image file here
  // Example: "image1.jpg": { title: "Event Name", category: "Events", caption: "Description", year: "2024", location: "BMMSWC" }
};

function getGalleryItems(): GalleryItem[] {
  const galleryDir = join(process.cwd(), "public", "gallery");

  try {
    const files = readdirSync(galleryDir);

    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    const items = files
      .filter((file) => {
        const ext = file.toLowerCase().substring(file.lastIndexOf("."));
        return imageExtensions.includes(ext);
      })
      .sort()
      .map((file, index) => {
        const metadata = galleryMetadata[file] || {
          title: `Gallery Image ${index + 1}`,
          category: "Events",
          caption: "Community photo from BMMSWC",
          year: new Date().getFullYear().toString(),
          location: "BMMSWC",
        };

        return {
          id: index + 1,
          src: `/gallery/${file}`,
          ...metadata,
        };
      });

    return items;
  } catch (error) {
    console.error("Failed to load gallery items:", error);
    return [];
  }
}

export const galleryItems = getGalleryItems();
