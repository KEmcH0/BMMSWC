import Link from 'next/link'
import { logout } from './actions'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <form action={logout}>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AdminCard title="Committee" href="/admin/committee" />
          <AdminCard title="Advisors" href="/admin/advisors" />
          <AdminCard title="Alumni" href="/admin/alumni" />
          <AdminCard title="News & Events" href="/admin/news" />
          <AdminCard title="Exam Results" href="/admin/results" />
          <AdminCard title="Gallery" href="/admin/gallery" />
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2">Tips</h2>
          <ul className="opacity-80 text-sm list-disc ml-5 space-y-1">
            <li>Changes appear on the website immediately.</li>
            <li>Photos are resized automatically before upload — you can pick photos straight from your phone.</li>
            <li>Results stay hidden until you tick “Published” on the exam.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function AdminCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="bg-card border rounded-lg p-6 hover:shadow-lg transition block">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <span className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
        Manage
      </span>
    </Link>
  )
}
