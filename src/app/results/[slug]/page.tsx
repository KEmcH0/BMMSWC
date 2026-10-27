import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileDown, MapPin, School, Trophy } from "lucide-react";
import Avatar from "@/components/Avatar";
import { getExamBySlug, getResults, type ExamResult } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import RollSearch from "./RollSearch";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

// Each page is built on its first visit and then cached (nothing is pre-built at deploy time).
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

const PLACES: Record<number, { label: string; ring: string; badge: string }> = {
  1: { label: "1st", ring: "border-yellow-400", badge: "bg-yellow-400 text-yellow-950" },
  2: { label: "2nd", ring: "border-slate-300", badge: "bg-slate-300 text-slate-900" },
  3: { label: "3rd", ring: "border-amber-600", badge: "bg-amber-600 text-white" },
};
const OTHER_PLACE = { ring: "border-primary/20", badge: "bg-primary text-white" };

function placeLabel(n: number) {
  return PLACES[n]?.label ?? `${n}th`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exam = await getExamBySlug((await params).slug);
  if (!exam) return {};
  return { title: `${exam.title} Result | BMMSWC`, description: `Top students of ${exam.title}.` };
}

function TopperCard({ r, joint }: { r: ExamResult; joint: boolean }) {
  const place = { ...OTHER_PLACE, ...PLACES[r.merit_position!] };
  const first = r.merit_position === 1;
  return (
    <div
      className={`h-full bg-card border rounded-2xl p-6 text-center flex flex-col items-center shadow-sm ${
        first ? "shadow-lg border-yellow-400/60" : ""
      }`}
    >
      <div className="relative mb-4">
        <Avatar
          src={r.photo_url}
          name={r.name}
          size={first ? 128 : 112}
          className={`${first ? "w-32 h-32" : "w-28 h-28"} border-4 ${place.ring}`}
        />
        <span
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold px-3 py-1 rounded-full shadow ${place.badge}`}
        >
          {placeLabel(r.merit_position!)}
          {joint && " (joint)"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-primary dark:text-white mt-2">{r.name}</h3>
      {(r.father_name || r.mother_name) && (
        <div className="mt-2 text-sm text-muted-foreground space-y-0.5">
          {r.father_name && <p>Father: <span className="text-foreground">{r.father_name}</span></p>}
          {r.mother_name && <p>Mother: <span className="text-foreground">{r.mother_name}</span></p>}
        </div>
      )}
      {(r.school || r.village) && (
        <div className="mt-3 text-sm text-muted-foreground space-y-1">
          {r.school && (
            <p className="flex items-start justify-center gap-1.5">
              <School className="w-4 h-4 mt-0.5 shrink-0 text-secondary" /> {r.school}
            </p>
          )}
          {r.village && (
            <p className="flex items-start justify-center gap-1.5">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" /> {r.village}
            </p>
          )}
        </div>
      )}
      {r.marks !== null && (
        <p className="mt-3 text-2xl font-bold">
          {r.marks}
          <span className="text-sm font-medium opacity-60 ml-1">marks</span>
        </p>
      )}
    </div>
  );
}

export default async function ExamResult({ params }: Props) {
  const { slug } = await params;

  const exam = await getExamBySlug(slug);
  if (!exam) notFound();

  const results = await getResults(exam.id);

  const toppersByClass = site.resultClasses
    .map(({ key: cls, label }) => ({
      cls,
      label,
      toppers: results
        .filter((r) => r.class === cls && r.merit_position !== null)
        // Students sharing a (joint) place are listed by name.
        .sort((a, b) => a.merit_position! - b.merit_position! || a.name.localeCompare(b.name, "bn")),
    }))
    .filter((c) => c.toppers.length > 0);

  const toppersCount = toppersByClass.reduce((n, c) => n + c.toppers.length, 0);
  // Roll search only makes sense when more than the toppers were uploaded.
  const searchable = results.some((r) => r.roll) && results.length > toppersCount;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/results" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> All results
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-primary dark:text-white mb-3">{exam.title}</h1>
          {exam.exam_date && <p className="text-secondary font-medium">{formatDate(exam.exam_date)}</p>}
          {exam.description && <p className="opacity-80 mt-4 max-w-2xl mx-auto whitespace-pre-line">{exam.description}</p>}
          {exam.pdf_url && (
            <a
              href={`${exam.pdf_url}?download=${exam.slug}.pdf`}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              <FileDown className="w-4 h-4" /> Download official result (PDF)
            </a>
          )}
        </div>

        {toppersByClass.length === 0 && !searchable && (
          <p className="text-center opacity-70">Results will be published soon.</p>
        )}

        {/* Top 3 of each class */}
        <div className="space-y-16">
          {toppersByClass.map(({ cls, label, toppers }) => (
            <section key={cls}>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-secondary/30" />
                <h2 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2 whitespace-nowrap">
                  <Trophy className="w-6 h-6 text-secondary" /> {label}
                </h2>
                <div className="h-px flex-1 bg-secondary/30" />
              </div>
              <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                {toppers.map((r) => (
                  <div key={r.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                    <TopperCard
                      r={r}
                      joint={toppers.filter((t) => t.merit_position === r.merit_position).length > 1}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Roll search, only when the full result list was uploaded */}
        {searchable && <RollSearch examId={exam.id} />}
      </div>
    </div>
  );
}
