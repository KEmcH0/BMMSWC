"use client";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import type { Person } from "@/lib/db";

export default function AdvisorsView({ advisors }: { advisors: Person[] }) {
  const [search, setSearch] = useState("");

  const filteredAdvisors = advisors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Honorable Advisors</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">
          Guiding lights of our community who provide wisdom and support.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search advisors..."
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredAdvisors.length === 0 && <p className="text-center opacity-70">No advisors found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {filteredAdvisors.map((advisor) => (
          <div key={advisor.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Avatar src={advisor.photo_url} name={advisor.name} size={96} className="w-24 h-24 border-4 border-primary/10" />
            <div>
              <h3 className="text-xl font-bold text-primary mb-1">{advisor.name}</h3>
              <p className="text-secondary font-medium mb-3">{advisor.position}</p>
              {advisor.bio && <p className="opacity-70 text-sm mb-2">{advisor.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
