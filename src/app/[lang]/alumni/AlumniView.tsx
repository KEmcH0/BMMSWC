"use client";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import type { Person } from "@/lib/db";
import { dict, type Lang } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";

export default function AlumniView({ alumni, lang }: { alumni: Person[]; lang: Lang }) {
  const t = dict[lang].alumni;
  const [search, setSearch] = useState("");

  const filteredAlumni = alumni.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.text} />
      <div className="container mx-auto px-4 py-16">
        {alumni.length === 0 ? (
          <p className="text-center opacity-70">{t.soon}</p>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-10">
              <input
                type="text"
                placeholder={t.search}
                className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlumni.map((person) => (
                <div key={person.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center p-6 text-center">
                  <Avatar
                    src={person.photo_url}
                    name={person.name}
                    size={128}
                    className="w-32 h-32 mb-4 border-4 border-primary/10 group-hover:border-secondary transition-colors"
                  />
                  <h3 className="text-xl font-bold text-primary dark:text-white mb-1">{person.name}</h3>
                  <p className="text-secondary font-medium mb-3">{person.position}</p>
                  {person.bio && <p className="opacity-70 text-sm mt-auto border-t pt-3 w-full">{person.bio}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
