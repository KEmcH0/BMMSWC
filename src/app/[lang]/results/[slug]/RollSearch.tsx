"use client";

import { useActionState } from "react";
import { Search, Trophy } from "lucide-react";
import { classLabelFor, dict, digits, type Lang } from "@/lib/i18n";
import { searchRoll } from "../actions";

export default function RollSearch({ examId, lang }: { examId: string; lang: Lang }) {
  const t = dict[lang].results;
  const [state, action, pending] = useActionState(searchRoll, null);
  const found = state?.result;

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <form action={action} className="bg-card border rounded-2xl p-6 mb-6">
        <input type="hidden" name="exam_id" value={examId} />
        <label htmlFor="roll" className="block font-semibold mb-3">{t.find}</label>
        <div className="flex gap-3">
          <input
            id="roll"
            name="roll"
            defaultValue={state?.roll}
            required
            inputMode="numeric"
            placeholder={t.rollPlaceholder}
            className="flex-1 min-w-0 px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-primary text-white px-6 rounded-xl font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60"
          >
            <Search className="w-4 h-4" /> {pending ? t.searching : t.search}
          </button>
        </div>
      </form>

      {state && !found && (
        <div className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 rounded-2xl p-6 text-center">
          {t.notFound(state.roll)}
        </div>
      )}

      {found && (
        <div className="bg-card border-2 border-secondary/50 rounded-2xl p-6">
          {found.merit_position !== null && (
            <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary font-bold px-4 py-1.5 rounded-full mb-4">
              <Trophy className="w-4 h-4" /> {t.meritPosition(digits(found.merit_position, lang))}
            </div>
          )}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              [t.fields.name, found.name],
              [t.fields.roll, found.roll],
              [t.fields.father, found.father_name],
              [t.fields.mother, found.mother_name],
              [t.fields.village, found.village],
              [t.fields.school, found.school],
              [t.fields.class, found.class && classLabelFor(found.class, lang)],
              [t.fields.marks, found.marks === null ? "" : digits(found.marks, lang)],
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
  );
}
