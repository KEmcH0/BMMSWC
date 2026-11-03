"use server";

import { redirect } from "next/navigation";
import { getAchiever } from "@/lib/db";
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

    let photo_url = existing?.photo_url ?? "";
    const photo = formData.get("photo");
    if (isUpload(photo)) {
      photo_url = await uploadImage(photo, "achievers");
      await removeImage(existing?.photo_url);
    }

    const res = existing
      ? await supabase().from("achievers").update({ ...fields, photo_url }).eq("id", existing.id)
      : await supabase().from("achievers").insert({ ...fields, photo_url });
    if (res.error) return res.error.message;
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  revalidatePublicSite();
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
