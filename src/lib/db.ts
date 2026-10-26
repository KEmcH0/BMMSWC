import "server-only";
import { supabase } from "./supabase";

export type PersonKind = "committee" | "advisor" | "alumni";

export type Person = {
  id: string;
  kind: PersonKind;
  name: string;
  position: string;
  bio: string;
  photo_url: string;
  sort_order: number;
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  body: string;
  image_url: string;
  published: boolean;
};

export type GalleryItem = {
  id: string;
  album_id: string | null;
  image_url: string;
  caption: string;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type Album = {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string | null;
  cover_url: string;
  news_id: string | null;
  created_at: string;
};

export type AlbumSummary = Album & { photo_count: number; cover: string };

export type Exam = {
  id: string;
  slug: string;
  title: string;
  description: string;
  exam_date: string | null;
  pdf_url?: string; // missing until migration 005 has been run
  published: boolean;
};

export type ExamResult = {
  id: string;
  exam_id: string;
  roll: string | null;
  name: string;
  father_name: string;
  mother_name: string;
  village: string;
  school: string;
  class: string;
  marks: number | null;
  merit_position: number | null;
  photo_url: string;
};

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

// People ---------------------------------------------------------------

export async function getPeople(kind: PersonKind) {
  return check<Person[]>(
    await supabase()
      .from("people")
      .select("*")
      .eq("kind", kind)
      .order("sort_order")
      .order("created_at")
  );
}

export async function getPerson(id: string) {
  return check<Person | null>(await supabase().from("people").select("*").eq("id", id).maybeSingle());
}

export async function countPeople(kind: PersonKind) {
  const { count, error } = await supabase()
    .from("people")
    .select("id", { count: "exact", head: true })
    .eq("kind", kind);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// News -----------------------------------------------------------------

export async function getNews({ includeDrafts = false, limit }: { includeDrafts?: boolean; limit?: number } = {}) {
  let q = supabase().from("news").select("*").order("date", { ascending: false });
  if (!includeDrafts) q = q.eq("published", true);
  if (limit) q = q.limit(limit);
  return check<NewsItem[]>(await q);
}

export async function getNewsBySlug(slug: string) {
  return check<NewsItem | null>(
    await supabase().from("news").select("*").eq("slug", slug).eq("published", true).maybeSingle()
  );
}

export async function getNewsById(id: string) {
  return check<NewsItem | null>(await supabase().from("news").select("*").eq("id", id).maybeSingle());
}

// Gallery --------------------------------------------------------------

export async function getGallery(limit?: number) {
  let q = supabase().from("gallery").select("*").order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  return check<GalleryItem[]>(await q);
}

// Albums ---------------------------------------------------------------

// Newest event first; albums without a date sort by when they were created.
export async function getAlbums({ includeEmpty = false } = {}): Promise<AlbumSummary[]> {
  const [albums, photos] = await Promise.all([
    supabase().from("albums").select("*"),
    supabase().from("gallery").select("album_id, image_url").order("created_at"),
  ]);
  const photoRows = check<Pick<GalleryItem, "album_id" | "image_url">[]>(photos);
  const sortKey = (a: Album) => a.event_date ?? a.created_at.slice(0, 10);

  return check<Album[]>(albums)
    .map((a) => {
      const own = photoRows.filter((p) => p.album_id === a.id);
      return { ...a, photo_count: own.length, cover: a.cover_url || own[0]?.image_url || "" };
    })
    .filter((a) => includeEmpty || a.photo_count > 0)
    .sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
}

export async function getAlbumBySlug(slug: string) {
  return check<Album | null>(await supabase().from("albums").select("*").eq("slug", slug).maybeSingle());
}

export async function getAlbumById(id: string) {
  return check<Album | null>(await supabase().from("albums").select("*").eq("id", id).maybeSingle());
}

export async function getAlbumForNews(newsId: string) {
  return check<Album | null>(
    await supabase().from("albums").select("*").eq("news_id", newsId).limit(1).maybeSingle()
  );
}

export async function getAlbumPhotos(albumId: string) {
  return check<GalleryItem[]>(
    await supabase().from("gallery").select("*").eq("album_id", albumId).order("created_at").order("id")
  );
}

// Exams ----------------------------------------------------------------

export async function getExams({ includeDrafts = false } = {}) {
  let q = supabase().from("exams").select("*").order("exam_date", { ascending: false, nullsFirst: false });
  if (!includeDrafts) q = q.eq("published", true);
  return check<Exam[]>(await q);
}

export async function getExamBySlug(slug: string) {
  return check<Exam | null>(
    await supabase().from("exams").select("*").eq("slug", slug).eq("published", true).maybeSingle()
  );
}

export async function getExamById(id: string) {
  return check<Exam | null>(await supabase().from("exams").select("*").eq("id", id).maybeSingle());
}

export async function findResult(examId: string, roll: string) {
  return check<ExamResult | null>(
    await supabase().from("exam_results").select("*").eq("exam_id", examId).eq("roll", roll.trim()).maybeSingle()
  );
}

export async function getResults(examId: string) {
  return check<ExamResult[]>(
    await supabase().from("exam_results").select("*").eq("exam_id", examId).order("class").order("merit_position", { nullsFirst: false }).order("roll")
  );
}

// Merit-list students across all published exams.
export async function countAwardees() {
  const { count, error } = await supabase()
    .from("exam_results")
    .select("id, exams!inner(published)", { count: "exact", head: true })
    .not("merit_position", "is", null)
    .eq("exams.published", true);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Settings ---------------------------------------------------------------

// Returns "" when the setting (or the settings table) does not exist yet, so pages fall back to defaults.
export async function getSetting(key: string) {
  const { data } = await supabase().from("settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as string | undefined) ?? "";
}
