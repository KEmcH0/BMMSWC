import Link from "next/link";
import Avatar from "@/components/Avatar";
import { AdminHeader, DeleteButton, SubmitButton } from "@/components/admin/ui";
import { getAchieverSubmissions, getAchievers } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { categoryLabel, siteUrl } from "@/lib/site";
import { approveSubmission, deleteAchiever, rejectSubmission } from "./actions";

export default async function AdminAchievers() {
  const [achievers, submissions] = await Promise.all([getAchievers(), getAchieverSubmissions()]);
  const formUrl = `${siteUrl}/achievers/submit`;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Achievers">
          <Link href="/admin/achievers/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">
            + Add student
          </Link>
        </AdminHeader>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-1">
            Waiting for approval{submissions && submissions.length > 0 && ` (${submissions.length})`}
          </h2>
          <p className="text-sm opacity-70 mb-4">
            Students send their own details from{" "}
            <a href={formUrl} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-secondary font-medium underline break-all">
              {formUrl}
            </a>
            . Share this link in a news post or on Facebook. Nothing appears on the website until you approve it.
          </p>

          <div className="bg-card border rounded-lg divide-y">
            {!submissions && (
              <p className="p-6 text-center">
                Student forms are not switched on yet. Run <code>supabase/migrations/007_achiever_submissions.sql</code> in
                Supabase → SQL Editor.
              </p>
            )}
            {submissions?.length === 0 && <p className="p-6 text-center opacity-70">No forms waiting.</p>}
            {submissions?.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4">
                {s.photo_url ? (
                  <a href={s.photo_url} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0" title="Open the full photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                  </a>
                ) : (
                  <Avatar src="" name={s.name} size={80} className="w-20 h-20" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm opacity-70">
                    {categoryLabel(s.category)} · {s.institution} · {s.subject}
                  </div>
                  <div className="text-sm opacity-70">
                    Session {s.session} · Admitted {s.admission_year} · {s.village}
                  </div>
                  {(s.phone || s.email || s.facebook) && (
                    <div className="text-sm opacity-70 break-all">{[s.phone, s.email, s.facebook].filter(Boolean).join(" · ")}</div>
                  )}
                  <div className="text-xs opacity-50 mt-1">Sent {formatDate(s.created_at.slice(0, 10))}</div>
                  {achievers.some((a) => a.name.toLowerCase() === s.name.toLowerCase()) && (
                    <div className="text-sm font-medium text-red-600 mt-1">Someone with this name is already on the list.</div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <form action={approveSubmission}>
                    <input type="hidden" name="id" value={s.id} />
                    <SubmitButton>Approve</SubmitButton>
                  </form>
                  <Link href={`/admin/achievers/submissions/${s.id}`} className="text-primary font-medium text-sm hover:underline">Edit</Link>
                  <form action={rejectSubmission}>
                    <input type="hidden" name="id" value={s.id} />
                    <DeleteButton confirmText={`Reject the form from ${s.name}? It will be deleted.`} label="Reject" />
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <h2 className="text-xl font-semibold mb-4">On the website</h2>
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
