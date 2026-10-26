import Link from "next/link";
import { Images } from "lucide-react";
import { AdminHeader } from "@/components/admin/ui";
import { getAlbums } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function AdminGallery() {
  const albums = await getAlbums({ includeEmpty: true });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Gallery albums">
          <Link href="/admin/gallery/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">
            + New album
          </Link>
        </AdminHeader>

        <p className="text-sm opacity-70 mb-6">
          Make one album per event, then open it to add photos. Empty albums are hidden on the website.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.length === 0 && <p className="col-span-full text-center p-8 opacity-70">No albums yet.</p>}
          {albums.map((a) => (
            <Link key={a.id} href={`/admin/gallery/${a.id}`} className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {a.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.cover} alt="" className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center">
                  <Images className="w-10 h-10 opacity-30" />
                </div>
              )}
              <div className="p-3">
                <div className="font-semibold truncate">{a.title}</div>
                <div className="text-sm opacity-70">
                  {a.photo_count} photos{a.event_date && ` · ${formatDate(a.event_date)}`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
