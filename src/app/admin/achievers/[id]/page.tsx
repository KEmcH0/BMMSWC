import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { getAchiever } from "@/lib/db";
import AchieverForm from "../AchieverForm";

export default async function EditAchiever({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const achiever = await getAchiever(id);
  if (!achiever) notFound();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title={`Edit ${achiever.name}`} back="/admin/achievers" />
        <AchieverForm achiever={achiever} />
      </div>
    </div>
  );
}
