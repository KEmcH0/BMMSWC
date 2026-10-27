"use server";

import { redirect } from "next/navigation";
import { getPerson } from "@/lib/db";
import { isUpload, removeImage, requireAdmin, revalidatePublicSite, text, uploadImage } from "@/lib/admin";
import { supabase } from "@/lib/supabase";
import { PEOPLE_CONFIG, isPersonKind } from "./config";

export async function savePerson(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const kind = text(formData, "kind");
  if (!isPersonKind(kind)) return "Unknown section.";

  const name = text(formData, "name");
  if (!name) return "Name is required.";

  const fields = {
    kind,
    name,
    position: text(formData, "position"),
    bio: text(formData, "bio"),
    sort_order: Number(text(formData, "sort_order")) || 0,
  };

  try {
    const existing = id ? await getPerson(id) : null;
    if (id && !existing) return "This person no longer exists.";

    let photo_url = existing?.photo_url ?? "";
    const photo = formData.get("photo");
    if (isUpload(photo)) {
      photo_url = await uploadImage(photo, kind);
      await removeImage(existing?.photo_url);
    }

    const res = existing
      ? await supabase().from("people").update({ ...fields, photo_url }).eq("id", existing.id)
      : await supabase().from("people").insert({ ...fields, photo_url });
    if (res.error) return res.error.message;
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  revalidatePublicSite();
  redirect(PEOPLE_CONFIG[kind].listPath);
}

export async function deletePerson(formData: FormData) {
  await requireAdmin();
  const person = await getPerson(text(formData, "id"));
  if (!person) redirect("/admin");

  const { error } = await supabase().from("people").delete().eq("id", person.id);
  if (error) throw new Error(error.message);
  await removeImage(person.photo_url);
  revalidatePublicSite();
  redirect(PEOPLE_CONFIG[person.kind].listPath);
}
