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
  image_url: string;
  caption: string;
  created_at: string;
};

export type Exam = {
  id: string;
  slug: string;
  title: string;
  description: string;
  exam_date: string | null;
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
