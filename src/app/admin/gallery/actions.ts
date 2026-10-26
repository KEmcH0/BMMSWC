"use server";

import { revalidatePath } from "next/cache";
import { isUpload, removeImage, requireAdmin, text, uploadImage } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export async function uploadGallery(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const files = formData.getAll("photos").filter(isUpload);
  if (!files.length) return "Choose at least one photo.";
  const caption = text(formData, "caption");

  try {
    for (const file of files) {
      const image_url = await uploadImage(file, "gallery");
      const { error } = await supabase().from("gallery").insert({ image_url, caption });
      if (error) {
        await removeImage(image_url);
        return error.message;
      }
    }
  } catch (e) {
    return e instanceof Error ? e.message : "Upload failed.";
  }

  revalidatePath("/admin/gallery");
  return null;
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const { data } = await supabase().from("gallery").select("image_url").eq("id", id).maybeSingle();
  if (data) {
    const { error } = await supabase().from("gallery").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await removeImage(data.image_url);
  }
  revalidatePath("/admin/gallery");
}
