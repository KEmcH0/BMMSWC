"use client";
import { useState } from "react";
import { Briefcase, Search } from "lucide-react";
import Avatar from "@/components/Avatar";
import PageHeader from "@/components/PageHeader";
import type { Person } from "@/lib/db";

function AdvisorCard({ advisor }: { advisor: Person }) {
  // "Advisor" is implied on this page; only show the title when it says something more (e.g. "Chief Advisor").
  const title = advisor.position && advisor.position.toLowerCase() !== "advisor" ? advisor.position : "";

  return (
    <article className="group bg-card border rounded-2xl overflow-hidden text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all">
      <div className="relative h-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 pattern-grid" aria-hidden />
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/25 blur-2xl" aria-hidden />
      </div>
      <div className="-mt-[72px] px-6 pb-7">
        <div className="relative mx-auto w-36 h-36 rounded-full bg-card p-1.5 shadow-lg">
          <Avatar
            src={advisor.photo_url}
            name={advisor.name}
            size={144}
            className="w-full h-full ring-2 ring-secondary transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {title && <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{title}</p>}
        <h3 className={`${title ? "mt-1" : "mt-5"} font-display text-xl font-semibold leading-snug text-primary dark:text-white`}>
          {advisor.name}
        </h3>
        <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-secondary/70" />
        {advisor.bio ? (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            <Briefcase className="inline w-4 h-4 mr-1.5 -mt-0.5 text-secondary" />
            {advisor.bio}
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Advisor, BMMSWC</p>
        )}
      </div>
    </article>
  );
}

export default function AdvisorsView({ advisors }: { advisors: Person[] }) {
  const [search, setSearch] = useState("");

  const q = search.toLowerCase();
  const filteredAdvisors = advisors.filter(
    (a) => a.name.toLowerCase().includes(q) || a.bio.toLowerCase().includes(q)
  );

  return (
    <>
      <PageHeader
        eyebrow="Guidance"
        title="Honorable Advisors"
        description="Respected teachers, doctors and professionals who guide our community with their wisdom and experience."
      />
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <p className="text-muted-foreground">
            <span className="font-display text-2xl font-semibold text-primary dark:text-white mr-2">{advisors.length}</span>
            advisors guiding BMMSWC
          </p>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or profession..."
              className="w-full pl-11 pr-4 py-2.5 border rounded-full bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredAdvisors.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No advisors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAdvisors.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
