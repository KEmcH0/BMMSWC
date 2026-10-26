import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { todayInDhaka } from "@/lib/format";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TABLES = ["people", "news", "albums", "gallery", "exams", "exam_results", "settings"];

// Downloads every table as one JSON file. Photos themselves stay in Supabase Storage; only their links are saved.
export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) return new NextResponse("Unauthorized", { status: 401 });

  const backup: Record<string, unknown> = { created_at: new Date().toISOString() };
  for (const table of TABLES) {
    const { data, error } = await supabase().from(table).select("*");
    // A table that does not exist yet (migration not run) is skipped rather than failing the whole backup.
    backup[table] = error ? { error: error.message } : data;
  }

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="bmmswc-backup-${todayInDhaka()}.json"`,
    },
  });
}
