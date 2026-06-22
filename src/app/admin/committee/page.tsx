import Link from 'next/link'
import { committeeMembers } from '@/lib/data'

export default function AdminCommittee() {

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-primary hover:underline">← Admin</Link>
          <h1 className="text-3xl font-bold">Committee</h1>
        </div>

        {/* Members List */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Position</th>
                <th className="text-left p-4">Profile</th>
              </tr>
            </thead>
            <tbody>
              {committeeMembers.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center">No members yet</td></tr>
              ) : (
                committeeMembers.map(member => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{member.name}</td>
                    <td className="p-4">{member.position}</td>
                    <td className="p-4 text-sm">{member.profile || '–'}</td>
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
