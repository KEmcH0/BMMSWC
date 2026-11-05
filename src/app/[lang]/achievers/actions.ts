"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { isUpload, removeImage, text, uploadImage } from "@/lib/admin";
import { dict, isLang } from "@/lib/i18n";
import { achieverCategories } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export type SubmitResult = { sent: true } | { error: string };

// Stops one person, or a flood of forms, from filling the approval list and the photo storage.
const MAX_WAITING = 100;
const MAX_PER_SENDER_PER_HOUR = 10;

// The file type a browser reports can't be trusted on a public form, so look at the file's first bytes.
async function isPhoto(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && ascii(1, 4) === "PNG";
  const webp = ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  return jpeg || png || webp;
}

// Accepts "facebook.com/name" as well as a full link. Returns null for anything but Facebook: on the website this link
// sits behind an icon, so a link to another site would be easy to miss when approving.
function facebookLink(value: string) {
  if (!value) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return /(^|\.)(facebook\.com|fb\.com|fb\.me)$/i.test(url.hostname) ? url.href : null;
  } catch {
    return null;
  }
}

// A salted hash of the sender's IP address, so repeat forms can be limited without storing the address itself.
async function senderHash() {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "";
  return createHash("sha256").update(`${ip}:${process.env.SUPABASE_SECRET_KEY}`).digest("hex");
}

// Open to everyone, so unlike the admin actions there is no login check. Forms only go into achiever_submissions,
// which the website never reads; nothing is shown publicly until an admin approves it.
export async function submitAchiever(formData: FormData): Promise<SubmitResult> {
  // Bots fill in every field, including this hidden one. They get the normal reply so they don't try another way.
  if (text(formData, "leave_empty")) return { sent: true };

  const lang = text(formData, "lang");
  const t = dict[isLang(lang) ? lang : "en"].submit.errors;
  const field = (key: string, max: number) => text(formData, key).slice(0, max);
  const category = field("category", 20);
  const admission_year = Number(field("admission_year", 4));
  const facebook = facebookLink(field("facebook", 300));
  const sentPhoto = formData.get("photo");
  const photo = isUpload(sentPhoto) ? sentPhoto : null; // optional: without one, the website shows the student's initials
  const fields = {
    name: field("name", 120),
    village: field("village", 120),
    category,
    institution: field("institution", 160),
    subject: field("subject", 100),
    session: field("session", 20),
    admission_year,
    phone: field("phone", 30),
    email: field("email", 120),
  };

  if (!fields.name || !fields.village || !fields.institution || !fields.subject || !fields.session) {
    return { error: t.required };
  }
  if (!achieverCategories.some((c) => c.key === category)) return { error: t.category };
  if (!Number.isInteger(admission_year) || admission_year < 1950 || admission_year > new Date().getFullYear() + 1) {
    return { error: t.year };
  }
  if (fields.phone && !/^\+?[\d\s()-]{6,30}$/.test(fields.phone)) {
    return { error: t.phone };
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { error: t.email };
  }
  if (facebook === null) return { error: t.facebook };
  if (photo && !(await isPhoto(photo))) return { error: t.photo };
  if (!formData.get("consent")) return { error: t.consent };

  let photo_url = "";
  try {
    const sender_hash = await senderHash();
    const anHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const [waiting, recent] = await Promise.all([
      supabase().from("achiever_submissions").select("id", { count: "exact", head: true }),
      supabase()
        .from("achiever_submissions")
        .select("id", { count: "exact", head: true })
        .eq("sender_hash", sender_hash)
        .gte("created_at", anHourAgo),
    ]);
    // A missing table (migration not run) gives no error here, only an empty count. Stopping now, before the upload,
    // means it can't leave an unused photo behind.
    if (waiting.count === null || recent.count === null) {
      throw new Error(waiting.error?.message ?? recent.error?.message ?? "Could not count achiever_submissions.");
    }
    if (recent.count >= MAX_PER_SENDER_PER_HOUR) {
      return { error: t.tooMany };
    }
    if (waiting.count >= MAX_WAITING) {
      return { error: t.full };
    }

    if (photo) photo_url = await uploadImage(photo, "achievers");
    const { error } = await supabase()
      .from("achiever_submissions")
      .insert({ ...fields, facebook, photo_url, sender_hash });
    if (error) throw new Error(error.message);
    return { sent: true };
  } catch (e) {
    console.error("submitAchiever:", e);
    await removeImage(photo_url);
    return { error: t.failed };
  }
}
