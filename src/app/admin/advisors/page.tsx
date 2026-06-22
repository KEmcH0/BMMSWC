import Link from 'next/link'
import { advisors } from '@/lib/data'

export default function AdminAdvisors() {

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-primary hover:underline">← Admin</Link>
          <h1 className="text-3xl font-bold">Advisors</h1>
        </div>

        {/* Advisors List */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Designation</th>
                <th className="text-left p-4">Bio</th>
              </tr>
            </thead>
            <tbody>
              {advisors.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center">No advisors yet</td></tr>
              ) : (
                advisors.map(advisor => (
                  <tr key={advisor.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{advisor.name}</td>
                    <td className="p-4">{advisor.designation}</td>
                    <td className="p-4 text-sm">{advisor.bio || '–'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
