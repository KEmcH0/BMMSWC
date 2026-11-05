"use server";

import { redirect } from "next/navigation";
import { getNewsById } from "@/lib/db";
import { isUpload, removeImage, requireAdmin, revalidatePublicSite, text, uploadImage } from "@/lib/admin";
import { slugify } from "@/lib/format";
import { supabase } from "@/lib/supabase";

async function uniqueSlug(title: string, date: string) {
  const base = slugify(title) || `news-${date}`;
  const { data } = await supabase().from("news").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
}

export async function saveNews(_prev: string | null, formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const date = text(formData, "date");
  const fields = {
    title,
    date,
    category: text(formData, "category") || "News",
    body: text(formData, "body"),
    published: formData.get("published") === "on",
  };
  if (!title || !date) return "Title and date are required.";
  const title_bn = text(formData, "title_bn");
  const body_bn = text(formData, "body_bn");

  try {
    const existing = id ? await getNewsById(id) : null;
    if (id && !existing) return "This news item no longer exists.";

    let image_url = existing?.image_url ?? "";
    const image = formData.get("image");
    if (isUpload(image)) image_url = await uploadImage(image, "news");

    // Left out when there is no Bangla text, so posts can still be saved before migration 008 has been run.
    const bangla = title_bn || body_bn || existing?.title_bn || existing?.body_bn ? { title_bn, body_bn } : {};
    const res = existing
      ? await supabase().from("news").update({ ...fields, ...bangla, image_url }).eq("id", existing.id)
      : await supabase().from("news").insert({ ...fields, ...bangla, image_url, slug: await uniqueSlug(title, date) });
    if (res.error) {
      if (image_url !== existing?.image_url) await removeImage(image_url);
      return res.error.code === "PGRST204"
        ? "Bangla text can't be saved yet. Run supabase/migrations/008_news_bangla.sql in Supabase → SQL Editor."
        : res.error.message;
    }
    if (existing && image_url !== existing.image_url) await removeImage(existing.image_url);
  } catch (e) {
    return e instanceof Error ? e.message : "Something went wrong.";
  }

  revalidatePublicSite();
  redirect("/admin/news");
}

export async function deleteNews(formData: FormData) {
  await requireAdmin();
  const item = await getNewsById(text(formData, "id"));
  if (item) {
    const { error } = await supabase().from("news").delete().eq("id", item.id);
    if (error) throw new Error(error.message);
    await removeImage(item.image_url);
  }
  revalidatePublicSite();
  redirect("/admin/news");
}
