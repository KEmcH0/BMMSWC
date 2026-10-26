import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import { MEDIA_BUCKET, supabase } from "./supabase";

// Every admin server action must call this first: server actions can be invoked
// from any page, so the /admin middleware alone does not protect them.
export async function requireAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) redirect("/admin/login");
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 4 * 1024 * 1024;

export function isUpload(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

export async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Only JPG, PNG, WebP, GIF or AVIF images are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Image is larger than 4 MB.");
  return uploadToStorage(file, folder);
}

// PDFs are not resized in the browser, so keep them under the 4 MB request limit with some room to spare.
export async function uploadPdf(file: File, folder: string) {
  if (file.type !== "application/pdf") throw new Error("Only PDF files are allowed.");
  if (file.size > 3.5 * 1024 * 1024) throw new Error("PDF is larger than 3.5 MB.");
  return uploadToStorage(file, folder);
}

async function uploadToStorage(file: File, folder: string) {
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { error } = await supabase()
    .storage.from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message);

  return supabase().storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

// Removes an image from storage if it was uploaded there. Images that live in /public are left alone.
export async function removeImage(url: string | null | undefined) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  if (!url || !url.includes(marker)) return;
  const path = decodeURIComponent(url.split(marker)[1]);
  await supabase().storage.from(MEDIA_BUCKET).remove([path]);
}

export function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
