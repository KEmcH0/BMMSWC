"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { dict, localePath, type Lang } from "@/lib/i18n";

// Shown instead of a blank crash page when a page fails to load (e.g. the database is unreachable).
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang: Lang = useParams().lang === "bn" ? "bn" : "en";
  const t = dict[lang].error;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">{t.title}</h1>
      <p className="opacity-80 max-w-xl mx-auto mb-8">
        {t.text}
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-left text-sm bg-muted border rounded-lg p-4 max-w-2xl mx-auto mb-8 whitespace-pre-wrap">
          {error.message}
        </pre>
      )}
      <div className="flex justify-center gap-4">
        <button onClick={reset} className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90">
          {t.retry}
        </button>
        <Link href={localePath(lang, "/contact")} className="border-2 border-primary text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white">
          {t.contact}
        </Link>
      </div>
    </div>
  );
}
