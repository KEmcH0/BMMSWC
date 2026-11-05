import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Avatar from "@/components/Avatar";
import type { Achiever } from "@/lib/db";
import { categoryLabelFor, dict, digits, localePath, type Lang } from "@/lib/i18n";
import { achieverCategories } from "@/lib/site";

// Navy band showing how many students got into medical, engineering and universities, with the latest few.
export default function HomeAchieversSection({ achievers, lang }: { achievers: Achiever[]; lang: Lang }) {
  if (!achievers.length) return null;
  const h = dict[lang].home;

  const counts = achieverCategories.map((c) => ({
    ...c,
    count: achievers.filter((a) => a.category === c.key).length,
  }));

  return (
    <section className="relative overflow-hidden py-24 bg-primary text-white dark:bg-primary-dark">
      <div className="absolute inset-0 pattern-grid" aria-hidden />
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" aria-hidden />
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-end mb-14">
          <div>
            <p className="eyebrow mb-3">{h.achieversEyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              {h.achieversTitle}
            </h2>
            <p className="mt-4 text-white/75 max-w-xl leading-relaxed">
              {h.achieversText(digits(achievers.length, lang))}
            </p>
          </div>
          <div className="grid grid-cols-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm overflow-hidden">
            {counts.map((c, i) => (
              <div key={c.key} className={`px-4 py-6 text-center ${i > 0 ? "border-l border-white/15" : ""}`}>
                <div className="font-display text-4xl font-semibold text-secondary">{digits(c.count, lang)}</div>
                <div className="mt-1 text-sm text-white/70">{categoryLabelFor(c.key, lang)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievers.slice(0, 8).map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-secondary/50 transition-colors"
            >
              {/* White backing keeps the navy initials readable on the navy band. */}
              <div className="shrink-0 rounded-full bg-white ring-2 ring-secondary/70">
                <Avatar src={a.photo_url} name={a.name} size={64} className="w-16 h-16" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold leading-snug truncate">{a.name}</p>
                <p className="text-sm text-secondary font-medium truncate">
                  {a.subject || categoryLabelFor(a.category, lang)}
                  {a.admission_year && <span className="text-white/50 font-normal"> · {digits(a.admission_year, lang)}</span>}
                </p>
                <p className="text-xs text-white/65 truncate">{a.institution}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={localePath(lang, "/achievers")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-secondary text-primary-dark font-semibold hover:brightness-110 transition"
          >
            {h.achieversButton} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
