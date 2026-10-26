import { AdminHeader } from "@/components/admin/ui";
import NewsForm from "../NewsForm";

export default function NewNews() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Add news" back="/admin/news" />
        <NewsForm />
      </div>
    </div>
  );
}
