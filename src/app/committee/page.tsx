"use client";
import { useState } from "react";
import { committeeMembers } from "@/lib/data";

type Member = (typeof committeeMembers)[number];

const LEADERS = ["President", "General Secretary"];
const EXECUTIVE = "Executive Member";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-2xl font-bold text-primary whitespace-nowrap">{title}</h2>
      <div className="h-px flex-1 bg-secondary/30" />
    </div>
  );
}

function LeaderCard({ member }: { member: Member }) {
  return (
    <div className="bg-card border-2 border-secondary/40 rounded-3xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center p-8 text-center">
      <div className="w-44 h-44 rounded-full overflow-hidden mb-5 border-4 border-secondary shadow-sm">
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <span className="inline-block bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full mb-3">
        {member.position}
      </span>
      <h3 className="text-2xl font-bold text-primary">{member.name}</h3>
    </div>
  );
}

function OfficerCard({ member }: { member: Member }) {
  return (
    <div className="bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center p-6 text-center">
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/10 group-hover:border-secondary transition-colors">
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
      <p className="text-secondary font-medium text-sm">{member.position}</p>
    </div>
  );
}

function ExecutiveCard({ member }: { member: Member }) {
  return (
    <div className="bg-card border rounded-xl hover:shadow-sm transition-shadow flex flex-col items-center p-4 text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-primary/10">
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-semibold text-primary leading-tight">{member.name}</h3>
    </div>
  );
}

export default function Committee() {
  const [search, setSearch] = useState("");

  const filteredMembers = committeeMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const leaders = LEADERS.flatMap((position) =>
    filteredMembers.filter((m) => m.position === position)
  );
  const officers = filteredMembers.filter(
    (m) => !LEADERS.includes(m.position) && m.position !== EXECUTIVE
  );
  const executives = filteredMembers.filter((m) => m.position === EXECUTIVE);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Current Committee</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">
          Meet the dedicated individuals leading BMMSWC towards a brighter future.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-14">
        <input
          type="text"
          placeholder="Search members..."
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredMembers.length === 0 && (
        <p className="text-center opacity-70">No members found.</p>
      )}

      {leaders.length > 0 && (
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {leaders.map((member) => (
              <LeaderCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {officers.length > 0 && (
        <section className="mb-16">
          <SectionHeading title="Office Bearers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {officers.map((member) => (
              <OfficerCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {executives.length > 0 && (
        <section>
          <SectionHeading title="Executive Members" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {executives.map((member) => (
              <ExecutiveCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
