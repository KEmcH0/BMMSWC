"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getExamById, getResults } from "@/lib/db";
import { isUpload, removeImage, requireAdmin, text, uploadImage, uploadPdf } from "@/lib/admin";
import { normalizeClass, parseResultsCSV } from "@/lib/csv";
import { slugify } from "@/lib/format";
import { supabase } from "@/lib/supabase";

async function uniqueSlug(title: string) {
  const base = slugify(title) || `exam-${Date.now()}`;
  const { data } = await supabase().from("exams").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function saveExam(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  if (!title) return "Title is required.";
  const fields = {
    title,
    description: text(formData, "description"),
    exam_date: text(formData, "exam_date") || null,
    published: formData.get("published") === "on",
  };

  let examId = id;
  try {
    // Official result PDF: replace it when a new file is chosen, or clear it when "remove" is ticked.
    const oldPdf = id ? ((await getExamById(id))?.pdf_url ?? "") : "";
    const pdf = formData.get("pdf");
    let pdf_url: string | undefined;
    if (isUpload(pdf)) pdf_url = await uploadPdf(pdf, "results");
    else if (formData.get("remove_pdf") === "on") pdf_url = "";

    if (id) {
      const { error } = await supabase()
        .from("exams")
        .update(pdf_url === undefined ? fields : { ...fields, pdf_url })
        .eq("id", id);
      if (error) {
        if (pdf_url) await removeImage(pdf_url);
        return error.message;
      }
      if (pdf_url !== undefined) await removeImage(oldPdf);
    } else {
      const { data, error } = await supabase()
        .from("exams")
        .insert({ ...fields, ...(pdf_url ? { pdf_url } : {}), slug: await uniqueSlug(title) })
        .select("id")
        .single();
      if (error) return error.message;
      examId = data.id;
    }
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  if (!id) redirect(`/admin/results/${examId}`);
  revalidatePath(`/admin/results/${examId}`);
  return null;
}

export type UploadState = { error: string | null; message: string | null };

export async function uploadResults(_prev: UploadState, formData: FormData): Promise<UploadState> {
  await requireAdmin();

  const exam = await getExamById(text(formData, "exam_id"));
  if (!exam) return { error: "Exam not found.", message: null };

  const file = formData.get("file");
  if (!isUpload(file)) return { error: "Choose a CSV file.", message: null };

  let rows;
  try {
    rows = parseResultsCSV(await file.text());
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not read the file.", message: null };
  }
  if (!rows.length) return { error: "The file has no result rows.", message: null };

  // Keep topper photos that were already uploaded: match by roll, else by class + position.
  const old = await getResults(exam.id);
  const photoFor = (r: (typeof rows)[number]) =>
    old.find((o) => o.photo_url && o.roll && o.roll === r.roll)?.photo_url ??
    old.find((o) => o.photo_url && r.merit_position !== null && o.class === r.class && o.merit_position === r.merit_position)
      ?.photo_url ??
    "";
  const withPhotos = rows.map((r) => ({ ...r, exam_id: exam.id, photo_url: photoFor(r) }));

  // The file was fully validated above, so it is safe to replace the old results now.
  const db = supabase();
  const del = await db.from("exam_results").delete().eq("exam_id", exam.id);
  if (del.error) return { error: del.error.message, message: null };

  const kept = new Set(withPhotos.map((r) => r.photo_url));
  await Promise.all(old.filter((o) => o.photo_url && !kept.has(o.photo_url)).map((o) => removeImage(o.photo_url)));

  for (let i = 0; i < withPhotos.length; i += 500) {
    const chunk = withPhotos.slice(i, i + 500);
    const { error } = await db.from("exam_results").insert(chunk);
    if (error) {
      return {
        error: `Upload stopped after ${i} rows: ${error.message}. Please upload the file again.`,
        message: null,
      };
    }
  }

  revalidatePath(`/admin/results/${exam.id}`);
  return { error: null, message: `${rows.length} results uploaded.` };
}

export async function deleteExam(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const photos = (await getResults(id)).map((r) => r.photo_url).filter(Boolean);
  const { error } = await supabase().from("exams").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await Promise.all(photos.map((url) => removeImage(url)));
  redirect("/admin/results");
}

// Saves one student on a class's merit list: updates it when an id is sent, otherwise adds a new one.
export async function saveTopper(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const exam = await getExamById(text(formData, "exam_id"));
  if (!exam) return "Exam not found.";
  const cls = normalizeClass(text(formData, "class"));
  const id = text(formData, "id");
  const position = Number(text(formData, "merit_position"));
  const name = text(formData, "name");
  const father_name = text(formData, "father_name");
  if (!cls || !position) return "Class and position are required.";
  if (!name) return "Name is required.";
  const village = text(formData, "village");
  if (!father_name) return "Father's name is required.";
  if (!village) return "Village is required.";

  const marksText = text(formData, "marks");
  const marks = marksText ? Number(marksText) : null;
  if (marks !== null && Number.isNaN(marks)) return "Marks must be a number.";

  const fields = {
    name,
    father_name,
    mother_name: text(formData, "mother_name"),
    village,
    school: text(formData, "school"),
    roll: text(formData, "roll") || null,
    marks,
  };

  try {
    const results = await getResults(exam.id);
    const existing = id ? results.find((r) => r.id === id) : undefined;
    if (id && !existing) return "This student was already removed. Please reload the page.";
    if (fields.roll && results.some((r) => r.roll === fields.roll && r.id !== existing?.id)) {
      return `Roll ${fields.roll} is already used by another student in this exam.`;
    }

    let photo_url = existing?.photo_url ?? "";
    const photo = formData.get("photo");
    if (isUpload(photo)) {
      photo_url = await uploadImage(photo, "toppers");
      await removeImage(existing?.photo_url);
    }

    const res = existing
      ? await supabase()
          .from("exam_results")
          .update({ ...fields, photo_url, merit_position: position })
          .eq("id", existing.id)
      : await supabase()
          .from("exam_results")
          .insert({ ...fields, photo_url, exam_id: exam.id, class: cls, merit_position: position });
    if (res.error) return res.error.message;
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  revalidatePath(`/admin/results/${exam.id}`);
  return null;
}

export async function removeTopper(formData: FormData) {
  await requireAdmin();
  const examId = text(formData, "exam_id");
  const { data, error } = await supabase()
    .from("exam_results")
    .delete()
    .eq("id", text(formData, "id"))
    .eq("exam_id", examId)
    .select("photo_url");
  if (error) throw new Error(error.message);
  await Promise.all((data ?? []).map((r) => removeImage(r.photo_url)));
  revalidatePath(`/admin/results/${examId}`);
}
