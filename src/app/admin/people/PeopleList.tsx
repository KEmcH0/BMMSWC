import Link from "next/link";
import { AdminHeader, DeleteButton } from "@/components/admin/ui";
import { getPeople, type PersonKind } from "@/lib/db";
import { PEOPLE_CONFIG } from "./config";
import { deletePerson } from "./actions";

export default async function PeopleList({ kind }: { kind: PersonKind }) {
  const cfg = PEOPLE_CONFIG[kind];
  const people = await getPeople(kind);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title={cfg.title}>
          <Link
            href={`/admin/people/new?kind=${kind}`}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium"
          >
            + Add {cfg.singular}
          </Link>
        </AdminHeader>

        <div className="bg-card border rounded-lg divide-y">
          {people.length === 0 && <p className="p-6 text-center opacity-70">Nobody added yet.</p>}
          {people.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <span className="w-10 text-sm opacity-50 text-right shrink-0">{p.sort_order}</span>
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden shrink-0">
                {p.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-sm opacity-70 truncate">{p.position}</div>
              </div>
              <Link href={`/admin/people/${p.id}`} className="text-primary font-medium text-sm hover:underline">Edit</Link>
              <form action={deletePerson}>
                <input type="hidden" name="id" value={p.id} />
                <DeleteButton confirmText={`Remove ${p.name}?`} label="Remove" />
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
