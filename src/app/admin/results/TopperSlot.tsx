"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { DeleteButton, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { ExamResult } from "@/lib/db";
import { removeTopper, saveTopper } from "./actions";

const PLACE = ["", "1st", "2nd", "3rd"];

export default function TopperSlot({
  examId,
  cls,
  clsLabel,
  position,
  result,
}: {
  examId: string;
  cls: string;
  clsLabel: string;
  position: number;
  result?: ExamResult;
}) {
  const [error, action] = useActionState(saveTopper, null);

  return (
    <div className="border rounded-lg p-4 bg-background">
      <div className="font-semibold mb-3">{PLACE[position] ?? `#${position}`} place</div>
      <form action={action} className="space-y-3">
        <input type="hidden" name="exam_id" value={examId} />
        <input type="hidden" name="class" value={cls} />
        <input type="hidden" name="merit_position" value={position} />
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
          <DeleteButton label="Remove" confirmText={`Remove ${result.name} from ${clsLabel} ${PLACE[position]} place?`} />
        </form>
      )}
    </div>
  );
}
