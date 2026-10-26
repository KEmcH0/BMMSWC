"use client";

import { useActionState } from "react";
import { FormError, SubmitButton } from "@/components/admin/ui";
import { uploadResults, type UploadState } from "./actions";

const initial: UploadState = { error: null, message: null };

export default function ResultsUpload({ examId, hasResults }: { examId: string; hasResults: boolean }) {
  const [state, action] = useActionState(uploadResults, initial);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (hasResults && !confirm("This replaces all current results for this exam (topper photos are kept). Continue?")) e.preventDefault();
      }}
      className="bg-card border rounded-lg p-6 space-y-4"
    >
      <input type="hidden" name="exam_id" value={examId} />
      <h2 className="text-lg font-semibold">Upload full results (CSV, optional)</h2>
      <p className="text-sm opacity-70">Only needed if students should be able to search their own result by roll number.</p>
      <ol className="text-sm opacity-80 list-decimal ml-5 space-y-1">
        <li>
          Download the{" "}
          <a href="/results-template.csv" download className="text-primary underline">template</a>{" "}
          and fill it in Excel or Google Sheets.
        </li>
        <li>Columns: <b>Roll</b> (required), Name, Father, Mother, Village, School, Class, Group, Marks, Position. Leave Position empty for students not on the merit list.</li>
        <li>For Class 12, write the <b>Group</b> as Science, Arts or Commerce. Mother and Marks can be left empty.</li>
        <li>Save as <b>CSV UTF-8</b> (Excel: File → Save As → “CSV UTF-8”) so Bangla names stay correct.</li>
        <li>Uploading again replaces the previous results for this exam. Topper photos are kept.</li>
      </ol>
      <input
        type="file"
        name="file"
        accept=".csv,text/csv"
        required
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
      />
      <FormError error={state.error} />
      {state.message && <p className="text-green-700 dark:text-green-400 text-sm font-medium">✓ {state.message}</p>}
      <SubmitButton>Upload results</SubmitButton>
    </form>
  );
}
