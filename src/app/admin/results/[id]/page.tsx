import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader, DeleteButton } from "@/components/admin/ui";
import { getExamById, getResults } from "@/lib/db";
import { deleteExam } from "../actions";
import ExamForm from "../ExamForm";
import ResultsUpload from "../ResultsUpload";
import TopperSlot from "../TopperSlot";
import { classLabel, site } from "@/lib/site";

const classOrder = (cls: string) => {
  const i = site.resultClasses.findIndex((c) => c.key === cls);
  return i < 0 ? site.resultClasses.length : i;
};

export default async function EditExam({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = await getExamById(id);
  if (!exam) notFound();
  const results = await getResults(exam.id);
  const merit = results
    .filter((r) => r.merit_position !== null)
    .sort((a, b) => classOrder(a.class) - classOrder(b.class) || a.merit_position! - b.merit_position!);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <AdminHeader title={exam.title} back="/admin/results">
          {exam.published && (
            <Link href={`/results/${exam.slug}`} target="_blank" className="text-primary font-medium hover:underline">
              View on website ↗
            </Link>
          )}
        </AdminHeader>

        <ExamForm exam={exam} />

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-1">Top 3 of each class</h2>
          <p className="text-sm opacity-70 mb-6">
            These are shown with photos on the result page. Fill each place and press Save.
          </p>
          <div className="space-y-8">
            {site.resultClasses.map(({ key: cls, label }) => (
              <section key={cls}>
                <h3 className="font-bold text-primary mb-3">{label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((pos) => (
                    <TopperSlot
                      key={pos}
                      examId={exam.id}
                      cls={cls}
                      clsLabel={label}
                      position={pos}
                      result={results.find((r) => r.class === cls && r.merit_position === pos)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <ResultsUpload examId={exam.id} hasResults={results.length > 0} />

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-1">All results</h2>
          <p className="text-sm opacity-70 mb-4">
            {results.length} students · {merit.length} on the merit list
          </p>
          {results.length > 0 && (
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    {["Pos.", "Roll", "Name", "Father", "Village", "School", "Class", "Marks"].map((h) => (
                      <th key={h} className="text-left p-2 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[...merit, ...results.filter((r) => r.merit_position === null)].map((r) => (
                    <tr key={r.id}>
                      <td className="p-2">{r.merit_position ?? "—"}</td>
                      <td className="p-2 font-mono">{r.roll ?? "—"}</td>
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.father_name}</td>
                      <td className="p-2">{r.village}</td>
                      <td className="p-2">{r.school}</td>
                      <td className="p-2 whitespace-nowrap">{classLabel(r.class)}</td>
                      <td className="p-2">{r.marks ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <form action={deleteExam} className="border border-red-200 dark:border-red-900 rounded-lg p-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Delete this exam</h2>
            <p className="text-sm opacity-70">Removes the exam and all its results.</p>
          </div>
          <input type="hidden" name="id" value={exam.id} />
          <DeleteButton label="Delete exam" confirmText={`Delete “${exam.title}” and all ${results.length} results?`} />
        </form>
      </div>
    </div>
  );
}
