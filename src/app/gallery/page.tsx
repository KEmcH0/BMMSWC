import { Gallery } from "@/components/Gallery";
import PageHeader from "@/components/PageHeader";
import { getGallery } from "@/lib/db";
import type { GalleryImage } from "@/lib/galleryData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery | BMMSWC",
  description: "Explore our collection of community events and activities",
};

export default async function GalleryPage() {
  const items = await getGallery();

  const galleryImages: GalleryImage[] = items.map((item, index) => ({
    id: index + 1,
    url: item.image_url,
    alt: item.caption || `BMMSWC gallery image ${index + 1}`,
    title: item.caption || `Gallery Image ${index + 1}`,
    description: item.caption || "Community photo from BMMSWC",
    category: "Events",
    aspectRatio: index % 3 === 0 ? "landscape" : index % 2 === 0 ? "portrait" : "square",
    featured: index === 0,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments from our programs"
        description="Capturing the moments and milestones of our community's journey."
      />
      <Gallery images={galleryImages} />
    </>
  );
}
