import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { getAchieverSubmission } from "@/lib/db";
import AchieverForm from "../../AchieverForm";

export default async function CheckSubmission({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getAchieverSubmission(id);
  if (!submission) notFound();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title={`Check ${submission.name}`} back="/admin/achievers" />
        <AchieverForm achiever={submission} submissionId={submission.id} />
      </div>
    </div>
  );
}
