import Link from 'next/link'
import { alumni } from '@/lib/data'

export default function AdminAlumni() {

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-primary hover:underline">← Admin</Link>
          <h1 className="text-3xl font-bold">Alumni</h1>
        </div>

        {/* Alumni List */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Batch</th>
                <th className="text-left p-4">Achievements</th>
              </tr>
            </thead>
            <tbody>
              {alumni.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center">No alumni yet</td></tr>
              ) : (
                alumni.map(member => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{member.name}</td>
                    <td className="p-4">{member.status}</td>
                    <td className="p-4">{member.achievements || '–'}</td>
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
