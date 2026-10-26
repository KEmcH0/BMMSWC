import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { getPerson } from "@/lib/db";
import { PEOPLE_CONFIG } from "../config";
import PersonForm from "../PersonForm";

export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title={`Edit ${person.name}`} back={PEOPLE_CONFIG[person.kind].listPath} />
        <PersonForm kind={person.kind} person={person} />
      </div>
    </div>
  );
}
