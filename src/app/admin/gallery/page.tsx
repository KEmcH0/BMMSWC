import { AdminHeader, DeleteButton } from "@/components/admin/ui";
import { getGallery } from "@/lib/db";
import { deleteGalleryItem } from "./actions";
import UploadForm from "./UploadForm";

export default async function AdminGallery() {
  const images = await getGallery();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title={`Gallery (${images.length})`} />
        <UploadForm />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length === 0 && <p className="col-span-full text-center p-8 opacity-70">No photos yet.</p>}
          {images.map((img) => (
            <div key={img.id} className="bg-card border rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.caption} className="w-full aspect-[4/3] object-cover" />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="text-xs opacity-70 truncate">{img.caption || "—"}</span>
                <form action={deleteGalleryItem}>
                  <input type="hidden" name="id" value={img.id} />
                  <DeleteButton confirmText="Delete this photo?" />
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
