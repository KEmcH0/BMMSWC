"use server";

import { redirect } from "next/navigation";
import { getAchiever, getAchieverSubmission } from "@/lib/db";
import { isUpload, removeImage, requireAdmin, revalidatePublicSite, text, uploadImage } from "@/lib/admin";
import { achieverCategories } from "@/lib/site";
import { supabase } from "@/lib/supabase";

// Accepts "facebook.com/name" as well as a full link.
function link(value: string) {
  return value && !/^https?:\/\//i.test(value) ? `https://${value}` : value;
}

export async function saveAchiever(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const submissionId = text(formData, "submission_id"); // set when publishing a student's form after checking it
  const category = text(formData, "category");
  const year = Number(text(formData, "admission_year"));
  const fields = {
    name: text(formData, "name"),
    category,
    institution: text(formData, "institution"),
    subject: text(formData, "subject"),
    session: text(formData, "session"),
    admission_year: Number.isInteger(year) && year > 1900 ? year : null,
    village: text(formData, "village"),
    phone: text(formData, "phone"),
    email: text(formData, "email"),
    facebook: link(text(formData, "facebook")),
  };
  if (!fields.name) return "Name is required.";
  if (!achieverCategories.some((c) => c.key === category)) return "Choose Medical, Engineering or University.";
  if (!fields.institution) return "University / college is required.";
  if (!fields.admission_year) return "Year of admission is required.";
  if (!fields.village) return "Village is required.";

  try {
    const existing = id ? await getAchiever(id) : null;
    if (id && !existing) return "This student no longer exists.";
    const submission = submissionId ? await getAchieverSubmission(submissionId) : null;
    if (submissionId && !submission) return "This form has already been approved or rejected.";

    const oldPhoto = existing?.photo_url ?? submission?.photo_url ?? "";
    let photo_url = oldPhoto;
    const photo = formData.get("photo");
    if (isUpload(photo)) photo_url = await uploadImage(photo, "achievers");

    const res = existing
      ? await supabase().from("achievers").update({ ...fields, photo_url }).eq("id", existing.id)
      : await supabase().from("achievers").insert({ ...fields, photo_url });
    if (res.error) return res.error.message;

    if (photo_url !== oldPhoto) await removeImage(oldPhoto);
    if (submission) await deleteSubmissionRow(submission.id);
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  revalidatePublicSite();
  redirect("/admin/achievers");
}

async function deleteSubmissionRow(id: string) {
  const { error } = await supabase().from("achiever_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Publishes a student's form as it is. The photo stays where it is; only the row moves.
export async function approveSubmission(formData: FormData) {
  await requireAdmin();
  const submission = await getAchieverSubmission(text(formData, "id"));
  if (submission) {
    const { id, created_at, ...fields } = submission; // eslint-disable-line @typescript-eslint/no-unused-vars
    const { error } = await supabase().from("achievers").insert(fields);
    if (error) throw new Error(error.message);
    await deleteSubmissionRow(id);
  }
  revalidatePublicSite();
  redirect("/admin/achievers");
}

export async function rejectSubmission(formData: FormData) {
  await requireAdmin();
  const submission = await getAchieverSubmission(text(formData, "id"));
  if (submission) {
    await deleteSubmissionRow(submission.id);
    await removeImage(submission.photo_url);
  }
  redirect("/admin/achievers");
}

export async function deleteAchiever(formData: FormData) {
  await requireAdmin();
  const achiever = await getAchiever(text(formData, "id"));
  if (achiever) {
    const { error } = await supabase().from("achievers").delete().eq("id", achiever.id);
    if (error) throw new Error(error.message);
    await removeImage(achiever.photo_url);
  }
  revalidatePublicSite();
  redirect("/admin/achievers");
}
