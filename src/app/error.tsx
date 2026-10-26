"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown instead of a blank crash page when a page fails to load (e.g. the database is unreachable).
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">This page could not be loaded</h1>
      <p className="opacity-80 max-w-xl mx-auto mb-8">
        Something went wrong on our side. Please try again in a moment.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="text-left text-sm bg-muted border rounded-lg p-4 max-w-2xl mx-auto mb-8 whitespace-pre-wrap">
          {error.message}
        </pre>
      )}
      <div className="flex justify-center gap-4">
        <button onClick={reset} className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary/90">
          Try again
        </button>
        <Link href="/contact" className="border-2 border-primary text-primary px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-white">
          Contact us
        </Link>
      </div>
    </div>
  );
}
