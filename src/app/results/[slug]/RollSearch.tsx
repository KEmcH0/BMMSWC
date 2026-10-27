"use client";

import { useActionState } from "react";
import { Search, Trophy } from "lucide-react";
import { classLabel } from "@/lib/site";
import { searchRoll } from "../actions";

export default function RollSearch({ examId }: { examId: string }) {
  const [state, action, pending] = useActionState(searchRoll, null);
  const found = state?.result;

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <form action={action} className="bg-card border rounded-2xl p-6 mb-6">
        <input type="hidden" name="exam_id" value={examId} />
        <label htmlFor="roll" className="block font-semibold mb-3">Find your result</label>
        <div className="flex gap-3">
          <input
            id="roll"
            name="roll"
            defaultValue={state?.roll}
            required
            inputMode="numeric"
            placeholder="Enter roll number"
            className="flex-1 min-w-0 px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-primary text-white px-6 rounded-xl font-semibold hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60"
          >
            <Search className="w-4 h-4" /> {pending ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {state && !found && (
        <div className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 rounded-2xl p-6 text-center">
          No result found for roll <b>{state.roll}</b>. Please check the number and try again.
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
  );
}
