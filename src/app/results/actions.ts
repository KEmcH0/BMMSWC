"use server";

import { findResult, getExamById, type ExamResult } from "@/lib/db";

export type RollSearchState = { roll: string; result: ExamResult | null } | null;

// Looks up one student by roll number in a published exam.
export async function searchRoll(_prev: RollSearchState, formData: FormData): Promise<RollSearchState> {
  const roll = String(formData.get("roll") ?? "").trim().slice(0, 40);
  const exam = await getExamById(String(formData.get("exam_id") ?? ""));
  if (!roll || !exam?.published) return null;
  return { roll, result: await findResult(exam.id, roll) };
}
