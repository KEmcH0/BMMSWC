import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { getNewsById } from "@/lib/db";
import NewsForm from "../NewsForm";

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getNewsById(id);
  if (!item) notFound();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Edit news" back="/admin/news" />
        <NewsForm item={item} />
      </div>
    </div>
  );
}
