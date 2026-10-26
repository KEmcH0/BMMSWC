"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAlbumById, getAlbumPhotos } from "@/lib/db";
import { isUpload, removeImage, requireAdmin, text, uploadImage } from "@/lib/admin";
import { slugify } from "@/lib/format";
import { supabase } from "@/lib/supabase";

async function uniqueSlug(title: string) {
  const base = slugify(title) || `album-${Date.now()}`;
  const { data } = await supabase().from("albums").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function saveAlbum(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  if (!title) return "Album name is required.";
  const fields = {
    title,
    description: text(formData, "description"),
    event_date: text(formData, "event_date") || null,
    news_id: text(formData, "news_id") || null,
  };

  let albumId = id;
  try {
    if (id) {
      const { error } = await supabase().from("albums").update(fields).eq("id", id);
      if (error) return error.message;
    } else {
      const { data, error } = await supabase()
        .from("albums")
        .insert({ ...fields, slug: await uniqueSlug(title) })
        .select("id")
        .single();
      if (error) return error.message;
      albumId = data.id;
    }
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  if (!id) redirect(`/admin/gallery/${albumId}`);
  revalidatePath(`/admin/gallery/${albumId}`);
  return null;
}

export async function deleteAlbum(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const photos = await getAlbumPhotos(id);
  // Photos are removed with the album (on delete cascade); their files are removed here.
  const { error } = await supabase().from("albums").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await Promise.all(photos.map((p) => removeImage(p.image_url)));
  redirect("/admin/gallery");
}

// Parses "1600x1067,1067x1600" sent by ImageInput.
function parseSizes(value: string) {
  return value.split(",").map((s) => {
    const [w, h] = s.split("x").map(Number);
    return w > 0 && h > 0 ? { width: Math.round(w), height: Math.round(h) } : { width: null, height: null };
  });
}

export async function uploadPhotos(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const album = await getAlbumById(text(formData, "album_id"));
  if (!album) return "Album not found.";
  const files = formData.getAll("photos").filter(isUpload);
  if (!files.length) return "Choose at least one photo.";
  const caption = text(formData, "caption");
  const sizes = parseSizes(text(formData, "photos_sizes"));

  try {
    for (const [i, file] of files.entries()) {
      const image_url = await uploadImage(file, "gallery");
      const { error } = await supabase()
        .from("gallery")
        .insert({ image_url, caption, album_id: album.id, ...(sizes[i] ?? {}) });
      if (error) {
        await removeImage(image_url);
        return error.message;
      }
    }
  } catch (e) {
    return e instanceof Error ? e.message : "Upload failed.";
  }

  revalidatePath(`/admin/gallery/${album.id}`);
  return null;
}

export async function updateCaption(formData: FormData) {
  await requireAdmin();
  const albumId = text(formData, "album_id");
  const { error } = await supabase()
    .from("gallery")
    .update({ caption: text(formData, "caption") })
    .eq("id", text(formData, "id"));
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/gallery/${albumId}`);
}

export async function setCover(formData: FormData) {
  await requireAdmin();
  const albumId = text(formData, "album_id");
  const { error } = await supabase()
    .from("albums")
    .update({ cover_url: text(formData, "image_url") })
    .eq("id", albumId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/gallery/${albumId}`);
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const { data } = await supabase().from("gallery").select("image_url, album_id").eq("id", id).maybeSingle();
  if (data) {
    const { error } = await supabase().from("gallery").delete().eq("id", id);
    if (error) throw new Error(error.message);
    // If this photo was the album cover, fall back to the first photo.
    if (data.album_id) {
      await supabase().from("albums").update({ cover_url: "" }).eq("id", data.album_id).eq("cover_url", data.image_url);
    }
    await removeImage(data.image_url);
  }
  revalidatePath(`/admin/gallery/${data?.album_id ?? ""}`);
}
