import Link from "next/link";
import { Award, ExternalLink, GraduationCap, Images, LogOut, Newspaper, Plus, UserRound, Users } from "lucide-react";
import { countPeople, getAlbums, getExams, getNews } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { logout } from "./actions";

export default async function AdminPage() {
  const [committee, advisors, alumni, news, exams, albums] = await Promise.all([
    countPeople("committee"),
    countPeople("advisor"),
    countPeople("alumni"),
    getNews({ includeDrafts: true }),
    getExams({ includeDrafts: true }),
    getAlbums({ includeEmpty: true }),
  ]);
  const photos = albums.reduce((n, a) => n + a.photo_count, 0);

  const sections = [
    { title: "News & Events", href: "/admin/news", icon: Newspaper, count: `${news.length} posts`, add: "/admin/news/new" },
    { title: "Exam Results", href: "/admin/results", icon: Award, count: `${exams.length} exams`, add: "/admin/results/new" },
    { title: "Gallery", href: "/admin/gallery", icon: Images, count: `${albums.length} albums · ${photos} photos`, add: "/admin/gallery/new" },
    { title: "Committee", href: "/admin/committee", icon: Users, count: `${committee} members` },
    { title: "Advisors", href: "/admin/advisors", icon: UserRound, count: `${advisors} advisors` },
    { title: "Alumni", href: "/admin/alumni", icon: GraduationCap, count: `${alumni} alumni`, note: "Hidden from the menu for now" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 pattern-grid" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">BMMSWC Admin</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-white/70">Changes appear on the website immediately.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 text-sm font-medium"
            >
              View website <ExternalLink className="w-4 h-4" />
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-red-500 text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map(({ title, href, icon: Icon, count, add, note }) => (
            <div key={href} className="group relative bg-card border rounded-2xl p-6 hover:shadow-lg hover:border-secondary/60 transition-all">
              <Link href={href} className="absolute inset-0 rounded-2xl" aria-label={title} />
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-secondary flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                {add && (
                  <Link
                    href={add}
                    className="relative inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-secondary px-3 py-1.5 rounded-full hover:bg-muted"
                  >
                    <Plus className="w-4 h-4" /> New
                  </Link>
                )}
              </div>
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{count}</p>
              {note && <p className="mt-2 text-xs text-secondary font-medium">{note}</p>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Latest news</h2>
            {news.length === 0 && <p className="text-sm text-muted-foreground">No news yet.</p>}
            <ul className="divide-y">
              {news.slice(0, 4).map((n) => (
                <li key={n.id}>
                  <Link href={`/admin/news/${n.id}`} className="flex items-center justify-between gap-4 py-3 hover:text-primary dark:hover:text-secondary">
                    <span className="truncate">{n.title}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {n.published ? formatDate(n.date) : "Draft"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Tips</h2>
            <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-2">
              <li>Photos are resized automatically before upload, so you can pick them straight from your phone.</li>
              <li>Results stay hidden until you tick “Published” on the exam.</li>
              <li>For a joint place in results, add two students with the same place.</li>
              <li>Make one gallery album per event, and link it to its news post.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
