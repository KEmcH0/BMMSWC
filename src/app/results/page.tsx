import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { getExams } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exam Results | BMMSWC",
  description: "Search BMMSWC merit test results by roll number.",
};

export default async function Results() {
  const exams = await getExams();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Exam Results</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">Select an exam and search your result with your roll number.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {exams.length === 0 && <p className="text-center opacity-70">No results have been published yet.</p>}
        {exams.map((e) => (
          <Link
            key={e.id}
            href={`/results/${e.slug}`}
            className="flex items-center gap-4 bg-card border rounded-2xl p-6 hover:shadow-md hover:border-secondary/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold">{e.title}</h2>
              {e.exam_date && <p className="text-sm opacity-70">{formatDate(e.exam_date)}</p>}
            </div>
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
