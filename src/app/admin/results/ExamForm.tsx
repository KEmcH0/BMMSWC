"use client";

import { useActionState } from "react";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Exam } from "@/lib/db";
import { saveExam } from "./actions";

export default function ExamForm({ exam }: { exam?: Exam }) {
  const [error, action] = useActionState(saveExam, null);

  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5">
      {exam && <input type="hidden" name="id" value={exam.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-5">
        <Field label="Exam name">
          <input name="title" required defaultValue={exam?.title} placeholder="BMMSWC Merit Test 2026" className={inputClass} />
        </Field>
        <Field label="Exam date">
          <input type="date" name="exam_date" defaultValue={exam?.exam_date ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Notice (optional)" hint="Shown above the result search, e.g. prize-giving date.">
        <textarea name="description" rows={3} defaultValue={exam?.description} className={inputClass} />
      </Field>

      <Field label="Official result PDF (optional)" hint="Shown as a download button on the result page. Up to 3.5 MB.">
        <input
          type="file"
          name="pdf"
          accept="application/pdf"
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
        />
      </Field>
      {exam?.pdf_url && (
        <div className="flex flex-wrap items-center gap-4 text-sm -mt-2">
          <a href={exam.pdf_url} target="_blank" className="text-primary underline">Current PDF ↗</a>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="remove_pdf" className="w-4 h-4" /> Remove PDF
          </label>
        </div>
      )}

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked={exam?.published ?? false} className="w-4 h-4" />
        <span className="text-sm font-medium">Published — students can search this result on the website</span>
      </label>

      <FormError error={error} />
      <SubmitButton>{exam ? "Save" : "Create exam"}</SubmitButton>
    </form>
  );
}
