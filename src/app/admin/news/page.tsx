import Link from 'next/link'

export default function AdminNews() {

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-primary hover:underline">← Admin</Link>
          <h1 className="text-3xl font-bold">News & Events</h1>
        </div>

        <div className="bg-card border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">News management is currently read-only. Edit news data in your data file.</p>
        </div>
      </div>
    </div>
  )
}
