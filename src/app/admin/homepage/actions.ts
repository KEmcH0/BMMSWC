"use server";

import { revalidatePath } from "next/cache";
import { getSetting } from "@/lib/db";
import { isUpload, removeImage, requireAdmin, revalidatePublicSite, uploadImage } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

async function setHero(value: string) {
  const old = await getSetting("hero_image");
  const { error } = await supabase().from("settings").upsert({ key: "hero_image", value });
  if (error) {
    if (value) await removeImage(value);
    return error.message.includes("settings")
      ? "The settings table is missing. Run supabase/migrations/005_exam_pdf_and_settings.sql in Supabase first."
      : error.message;
  }
  await removeImage(old);
  revalidatePublicSite();
  revalidatePath("/admin/homepage");
  return null;
}

export async function saveHero(_prev: string | null, formData: FormData) {
  await requireAdmin();
  const photo = formData.get("photo");
  if (!isUpload(photo)) return "Choose a photo.";
  try {
    return await setHero(await uploadImage(photo, "homepage"));
  } catch (e) {
    return e instanceof Error ? e.message : "Upload failed.";
  }
}

export async function resetHero() {
  await requireAdmin();
  const error = await setHero("");
  if (error) throw new Error(error);
}
