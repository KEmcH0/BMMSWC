import { AdminHeader } from "@/components/admin/ui";
import { getNews } from "@/lib/db";
import AlbumForm from "../AlbumForm";

export default async function NewAlbum() {
  const news = await getNews({ includeDrafts: true });
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <AdminHeader title="New album" back="/admin/gallery" />
        <AlbumForm news={news} />
      </div>
    </div>
  );
}
