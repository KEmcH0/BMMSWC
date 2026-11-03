import Link from "next/link";
import { AdminHeader, DeleteButton } from "@/components/admin/ui";
import { getAchievers } from "@/lib/db";
import { categoryLabel } from "@/lib/site";
import { deleteAchiever } from "./actions";

export default async function AdminAchievers() {
  const achievers = await getAchievers();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Achievers">
          <Link href="/admin/achievers/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">
            + Add student
          </Link>
        </AdminHeader>

        <div className="bg-card border rounded-lg divide-y">
          {achievers.length === 0 && <p className="p-6 text-center opacity-70">Nobody added yet.</p>}
          {achievers.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4">
              <span className="w-12 text-sm opacity-50 text-right shrink-0">{a.admission_year}</span>
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden shrink-0">
                {a.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.photo_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{a.name}</div>
                <div className="text-sm opacity-70 truncate">
                  {categoryLabel(a.category)} · {a.institution}
                  {a.subject && ` · ${a.subject}`}
                </div>
              </div>
              <Link href={`/admin/achievers/${a.id}`} className="text-primary font-medium text-sm hover:underline">Edit</Link>
              <form action={deleteAchiever}>
                <input type="hidden" name="id" value={a.id} />
                <DeleteButton confirmText={`Remove ${a.name}?`} label="Remove" />
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
