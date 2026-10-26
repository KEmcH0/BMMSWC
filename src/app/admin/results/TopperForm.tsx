"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { DeleteButton, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { ExamResult } from "@/lib/db";
import { removeTopper, saveTopper } from "./actions";

export const MERIT_PLACES = ["1st", "2nd", "3rd", "4th", "5th"];

// Edits one student on a class's merit list, or adds a new one when `result` is empty.
// Two students can share a place (joint position).
export default function TopperForm({
  examId,
  cls,
  clsLabel,
  result,
}: {
  examId: string;
  cls: string;
  clsLabel: string;
  result?: ExamResult;
}) {
  const [error, action] = useActionState(saveTopper, null);

  return (
    <div className={`border rounded-lg p-4 ${result ? "bg-background" : "bg-muted/50 border-dashed"}`}>
      <form action={action} className="space-y-3">
        <input type="hidden" name="exam_id" value={examId} />
        <input type="hidden" name="class" value={cls} />
        {result && <input type="hidden" name="id" value={result.id} />}
        <div className="flex items-center gap-3">
          <select
            name="merit_position"
            defaultValue={result?.merit_position ?? ""}
            required
            className={`${inputClass} !w-auto font-semibold`}
          >
            {!result && <option value="">Place…</option>}
            {MERIT_PLACES.map((label, i) => (
              <option key={label} value={i + 1}>{label}</option>
            ))}
          </select>
          {!result && <span className="text-sm font-medium opacity-70">Add a student</span>}
        </div>
        <input name="name" required placeholder="Name" defaultValue={result?.name} className={inputClass} />
        <input name="father_name" required placeholder="Father's name" defaultValue={result?.father_name} className={inputClass} />
        <input name="mother_name" placeholder="Mother's name (optional)" defaultValue={result?.mother_name} className={inputClass} />
        <input name="village" required placeholder="Village" defaultValue={result?.village} className={inputClass} />
        <input name="school" placeholder="School / College" defaultValue={result?.school} className={inputClass} />
        <div className="grid grid-cols-2 gap-3">
          <input name="marks" inputMode="decimal" placeholder="Marks (optional)" defaultValue={result?.marks ?? ""} className={inputClass} />
          <input name="roll" placeholder="Roll (optional)" defaultValue={result?.roll ?? ""} className={inputClass} />
        </div>
        <ImageInput name="photo" current={result?.photo_url || undefined} key={result?.photo_url} />
        <FormError error={error} />
        <SubmitButton className="w-full">{result ? "Save" : "Add"}</SubmitButton>
      </form>
      {result && (
        <form action={removeTopper} className="mt-2 text-right">
          <input type="hidden" name="exam_id" value={examId} />
          <input type="hidden" name="id" value={result.id} />
          <DeleteButton label="Remove" confirmText={`Remove ${result.name} from ${clsLabel}?`} />
        </form>
      )}
    </div>
  );
}
