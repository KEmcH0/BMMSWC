import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { getExams } from "@/lib/db";
import { formatDate } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exam Results | BMMSWC",
  description: "Search BMMSWC merit test results by roll number.",
};

export default async function Results() {
  const exams = await getExams();

  return (
    <>
      <PageHeader eyebrow="Merit Test" title="Exam Results" description="Top students of each class, with photos and marks." />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          {exams.length === 0 && <p className="text-center opacity-70">No results have been published yet.</p>}
          {exams.map((e) => (
            <Link
              key={e.id}
              href={`/results/${e.slug}`}
              className="flex items-center gap-4 bg-card border rounded-2xl p-6 hover:shadow-md hover:border-secondary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary text-secondary flex items-center justify-center shrink-0">
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
    </>
  );
}
