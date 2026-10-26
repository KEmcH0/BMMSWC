import Link from "next/link";
import { AdminHeader } from "@/components/admin/ui";
import { getExams } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function AdminResults() {
  const exams = await getExams({ includeDrafts: true });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Exam Results">
          <Link href="/admin/results/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 font-medium">
            + New exam
          </Link>
        </AdminHeader>

        <div className="bg-card border rounded-lg divide-y">
          {exams.length === 0 && <p className="p-6 text-center opacity-70">No exams yet.</p>}
          {exams.map((e) => (
            <Link key={e.id} href={`/admin/results/${e.id}`} className="flex items-center gap-4 p-4 hover:bg-muted">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{e.title}</div>
                <div className="text-sm opacity-70">{e.exam_date ? formatDate(e.exam_date) : "No date"}</div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${
                  e.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {e.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
