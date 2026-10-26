import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, School, Search, Trophy } from "lucide-react";
import Avatar from "@/components/Avatar";
import { findResult, getExamBySlug, getResults, type ExamResult } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { classLabel, site } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ roll?: string }>;
};

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

export default async function ExamResult({ params, searchParams }: Props) {
  const { slug } = await params;
  const roll = ((await searchParams).roll ?? "").trim().slice(0, 40);

  const exam = await getExamBySlug(slug);
  if (!exam) notFound();

  const [results, found] = await Promise.all([
    getResults(exam.id),
    roll ? findResult(exam.id, roll) : Promise.resolve(null),
  ]);

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
        {searchable && (
          <div className="max-w-2xl mx-auto mt-16">
            <form className="bg-card border rounded-2xl p-6 mb-6">
              <label htmlFor="roll" className="block font-semibold mb-3">Find your result</label>
              <div className="flex gap-3">
                <input
                  id="roll"
                  name="roll"
                  defaultValue={roll}
                  required
                  inputMode="numeric"
                  placeholder="Enter roll number"
                  className="flex-1 min-w-0 px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="bg-primary text-white px-6 rounded-xl font-semibold hover:bg-primary/90 flex items-center gap-2">
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
            </form>

            {roll && !found && (
              <div className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 rounded-2xl p-6 text-center">
                No result found for roll <b>{roll}</b>. Please check the number and try again.
              </div>
            )}

            {found && (
              <div className="bg-card border-2 border-secondary/50 rounded-2xl p-6">
                {found.merit_position !== null && (
                  <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary font-bold px-4 py-1.5 rounded-full mb-4">
                    <Trophy className="w-4 h-4" /> Merit position: {found.merit_position}
                  </div>
                )}
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    ["Name", found.name],
                    ["Roll", found.roll],
                    ["Father's name", found.father_name],
                    ["Mother's name", found.mother_name],
                    ["Village", found.village],
                    ["School", found.school],
                    ["Class", found.class && classLabel(found.class)],
                    ["Marks", found.marks?.toString()],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-sm opacity-60">{k}</dt>
                        <dd className="text-lg font-semibold">{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
