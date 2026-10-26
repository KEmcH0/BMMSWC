import Link from "next/link";
import { AdminHeader, DeleteButton } from "@/components/admin/ui";
import { getNews } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { deleteNews } from "./actions";

export default async function AdminNews() {
  const news = await getNews({ includeDrafts: true });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="News & Events">
          <Link href="/admin/news/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">
            + Add news
          </Link>
        </AdminHeader>

        <div className="bg-card border rounded-lg divide-y">
          {news.length === 0 && <p className="p-6 text-center opacity-70">No news yet.</p>}
          {news.map((n) => (
            <div key={n.id} className="flex items-center gap-4 p-4">
              <div className="w-20 h-14 rounded bg-muted overflow-hidden shrink-0">
                {n.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.image_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{n.title}</div>
                <div className="text-sm opacity-70">
                  {formatDate(n.date)} · {n.category}
                  {!n.published && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Draft</span>}
                </div>
              </div>
              <Link href={`/admin/news/${n.id}`} className="text-primary font-medium text-sm hover:underline">Edit</Link>
              <form action={deleteNews}>
                <input type="hidden" name="id" value={n.id} />
                <DeleteButton confirmText={`Delete “${n.title}”?`} />
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
