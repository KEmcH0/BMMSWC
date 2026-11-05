"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dict, localePath, type Lang } from "@/lib/i18n";

export default function NotFound() {
  const lang: Lang = /^\/bn(\/|$)/.test(usePathname()) ? "bn" : "en";
  const t = dict[lang].notFound;

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-primary dark:text-white mb-4">{t.title}</h1>
      <p className="opacity-80 max-w-xl mx-auto mb-8">{t.text}</p>
      <Link
        href={localePath(lang, "/")}
        className="inline-block bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90"
      >
        {t.home}
      </Link>
    </div>
  );
}
