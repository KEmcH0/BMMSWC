import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/ui";
import { getPeople } from "@/lib/db";
import { PEOPLE_CONFIG, isPersonKind } from "../config";
import PersonForm from "../PersonForm";

export default async function NewPerson({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind = "" } = await searchParams;
  if (!isPersonKind(kind)) notFound();
  const cfg = PEOPLE_CONFIG[kind];

  const people = await getPeople(kind);
  const nextOrder = (people.at(-1)?.sort_order ?? 0) + 10;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader title={`Add ${cfg.singular}`} back={cfg.listPath} />
        <PersonForm kind={kind} nextOrder={nextOrder} />
      </div>
    </div>
  );
}
