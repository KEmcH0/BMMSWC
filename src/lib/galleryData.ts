export type GalleryImage = {
  id: number;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
  featured?: boolean;
};
