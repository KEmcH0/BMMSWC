import { AdminHeader } from "@/components/admin/ui";
import AchieverForm from "../AchieverForm";

export default function NewAchiever() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title="Add student" back="/admin/achievers" />
        <AchieverForm />
      </div>
    </div>
  );
}
