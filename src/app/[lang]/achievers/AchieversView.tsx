"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import Avatar from "@/components/Avatar";
import PageHeader from "@/components/PageHeader";
import type { Achiever } from "@/lib/db";
import { categoryLabelFor, dict, digits, localePath, type Lang } from "@/lib/i18n";
import { achieverCategories } from "@/lib/site";

function AchieverCard({ a, lang }: { a: Achiever; lang: Lang }) {
  const t = dict[lang].achievers;
  const contacts = [
    a.phone && { href: `tel:${a.phone.replace(/[^\d+]/g, "")}`, label: t.call(a.phone), Icon: Phone },
    a.email && { href: `mailto:${a.email}`, label: a.email, Icon: Mail },
    a.facebook && { href: a.facebook, label: "Facebook", Icon: FaFacebookF },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Phone }[];

  return (
    <article className="bg-card border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-secondary/60 transition-all">
      <Avatar src={a.photo_url} name={a.name} size={112} className="w-28 h-28 mb-4 border-4 border-secondary/40" />
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-white mb-3">{categoryLabelFor(a.category, lang)}</span>
      <h3 className="text-lg font-bold text-primary dark:text-white leading-snug">{a.name}</h3>
      {a.subject && <p className="text-secondary font-semibold mt-1">{a.subject}</p>}
      <p className="text-sm text-muted-foreground mt-1">{a.institution}</p>
      {a.session && <p className="text-xs text-muted-foreground mt-1">{t.session(digits(a.session, lang))}</p>}
      {a.village && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-secondary" /> {a.village}
        </p>
      )}
      {contacts.length > 0 && (
        <div className="mt-auto pt-5 flex gap-2">
          {contacts.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted text-primary dark:text-secondary hover:bg-secondary hover:text-primary-dark transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function AchieversView({ achievers, lang }: { achievers: Achiever[]; lang: Lang }) {
  const t = dict[lang].achievers;
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const shown = achievers.filter(
    (a) =>
      (category === "all" || a.category === category) &&
      (!q || [a.name, a.village, a.institution, a.subject].some((v) => v.toLowerCase().includes(q)))
  );
  // Already sorted newest year first, so groups come out in order.
  const years = [...new Set(shown.map((a) => a.admission_year))];

  const tabs = [
    { key: "all", label: t.all, count: achievers.length },
    ...achieverCategories.map((c) => ({ key: c.key, label: categoryLabelFor(c.key, lang), count: achievers.filter((a) => a.category === c.key).length })),
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.text}
      >
        <Link
          href={localePath(lang, "/achievers/submit")}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-primary-dark font-semibold hover:brightness-110 transition"
        >
          {t.addButton} <ArrowRight className="w-4 h-4" />
        </Link>
      </PageHeader>
      <div className="container mx-auto px-4 py-16">
        {achievers.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <p>{t.soon}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setCategory(tab.key)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      category === tab.key ? "bg-primary text-white border-primary" : "bg-card hover:border-secondary"
                    }`}
                  >
                    {tab.label} <span className="opacity-60 font-normal">{digits(tab.count, lang)}</span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder={t.search}
                className="w-full md:w-80 px-4 py-2 border rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {shown.length === 0 && <p className="text-center opacity-70">{t.none}</p>}

            <div className="space-y-14">
              {years.map((year) => (
                <section key={year ?? "none"}>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-display text-2xl md:text-3xl font-semibold text-primary dark:text-white whitespace-nowrap">
                      {year ? t.admittedIn(digits(year, lang)) : t.other}
                    </h2>
                    <div className="h-px flex-1 bg-secondary/30" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {shown
                      .filter((a) => a.admission_year === year)
                      .map((a) => (
                        <AchieverCard key={a.id} a={a} lang={lang} />
                      ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
