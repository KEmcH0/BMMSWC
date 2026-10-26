import { AdminHeader } from "@/components/admin/ui";
import ExamForm from "../ExamForm";

export default function NewExam() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <AdminHeader title="New exam" back="/admin/results" />
        <ExamForm />
      </div>
    </div>
  );
}
