import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, DeleteButton, inputClass } from "@/components/admin/ui";
import { getAlbumById, getAlbumPhotos, getNews } from "@/lib/db";
import { deleteAlbum, deleteGalleryItem, setCover, updateCaption } from "../actions";
import AlbumForm from "../AlbumForm";
import UploadForm from "../UploadForm";

export default async function EditAlbum({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbumById(id);
  if (!album) notFound();
  const [photos, news] = await Promise.all([getAlbumPhotos(album.id), getNews({ includeDrafts: true })]);
  const cover = album.cover_url || photos[0]?.image_url;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminHeader title={album.title} back="/admin/gallery">
          {photos.length > 0 && (
            <Link href={`/gallery/${album.slug}`} target="_blank" className="text-primary font-medium hover:underline">
              View on website ↗
            </Link>
          )}
        </AdminHeader>

        <AlbumForm album={album} news={news} />
        <UploadForm albumId={album.id} />

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-1">Photos ({photos.length})</h2>
          <p className="text-sm opacity-70 mb-6">Edit a caption and press Enter to save it.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.length === 0 && <p className="col-span-full text-center p-8 opacity-70">No photos in this album yet.</p>}
            {photos.map((p) => (
              <div key={p.id} className={`border rounded-lg overflow-hidden bg-background ${p.image_url === cover ? "ring-2 ring-secondary" : ""}`}>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image_url} alt={p.caption} className="w-full aspect-[4/3] object-cover" />
                  {p.image_url === cover && (
                    <span className="absolute top-2 left-2 bg-secondary text-primary-dark text-xs font-bold px-2 py-0.5 rounded">Cover</span>
                  )}
                </div>
                <div className="p-2 space-y-2">
                  <form action={updateCaption}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="album_id" value={album.id} />
                    <input name="caption" defaultValue={p.caption} placeholder="Caption" className={`${inputClass} !py-1 text-sm`} />
                  </form>
                  <div className="flex items-center justify-between">
                    {p.image_url !== cover ? (
                      <form action={setCover}>
                        <input type="hidden" name="album_id" value={album.id} />
                        <input type="hidden" name="image_url" value={p.image_url} />
                        <button type="submit" className="text-sm text-primary hover:underline px-1">Set as cover</button>
                      </form>
                    ) : (
                      <span />
                    )}
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="id" value={p.id} />
                      <DeleteButton confirmText="Delete this photo?" />
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form action={deleteAlbum} className="border border-red-200 dark:border-red-900 rounded-lg p-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Delete this album</h2>
            <p className="text-sm opacity-70">Removes the album and all its photos.</p>
          </div>
          <input type="hidden" name="id" value={album.id} />
          <DeleteButton label="Delete album" confirmText={`Delete “${album.title}” and all ${photos.length} photos?`} />
        </form>
      </div>
    </div>
  );
}
