"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, inputClass } from "@/components/admin/ui";
import { achieverCategories } from "@/lib/site";
import { submitAchiever } from "../actions";

// Keeps the request under the 4 MB limit. Photos are normally far smaller after being resized in the browser.
const MAX_PHOTO_BYTES = 3.5 * 1024 * 1024;

export default function SubmitForm() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  // On a slow connection, sending before this page's script has loaded would put the details in the URL and drop the photo.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Sent by hand rather than with <form action>, which would clear everything typed, and the photo, whenever the
  // server sends back an error.
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const photo = data.get("photo");
    if (photo instanceof File && photo.size > MAX_PHOTO_BYTES) {
      setError("This photo is too large. Please choose one under 3.5 MB.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await submitAchiever(data);
        if ("error" in result) {
          setError(result.error);
        } else {
          setSent(true);
          window.scrollTo({ top: 0 }); // The thank-you is much shorter than the form; a phone would be left on the footer.
        }
      } catch {
        setError("Could not send the form. Check your internet connection and try again.");
      }
    });
  }

  if (sent) {
    return (
      <div className="max-w-xl mx-auto text-center bg-card border rounded-2xl p-8 md:p-12">
        <CheckCircle2 className="w-14 h-14 mx-auto text-secondary" />
        <h2 className="mt-5 font-display text-2xl md:text-3xl font-semibold text-primary dark:text-white">Thank you!</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          We have received your details. Your name will appear on the Achievers list after an admin has checked them.
        </p>
        <Link
          href="/achievers"
          className="mt-8 inline-flex items-center gap-2 font-semibold text-primary dark:text-white hover:gap-3 transition-all"
        >
          See our achievers <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto bg-card border rounded-2xl p-6 md:p-8 space-y-5">
      {/* Hidden from people, but bots fill it in; see submitAchiever. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="leave_empty" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Your name">
          <input name="name" required maxLength={120} autoComplete="name" className={inputClass} />
        </Field>
        <Field label="Village">
          <input name="village" required maxLength={120} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5">
        <Field label="Type of admission">
          <select name="category" required defaultValue="" className={`${inputClass} h-[42px]`}>
            <option value="" disabled>Choose…</option>
            {achieverCategories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="University / college" hint="e.g. Sylhet MAG Osmani Medical College">
          <input name="institution" required maxLength={160} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Subject" hint="e.g. MBBS, CSE, English">
          <input name="subject" required maxLength={100} className={inputClass} />
        </Field>
        <Field label="Session" hint="e.g. 2023-24">
          <input name="session" required maxLength={20} className={inputClass} />
        </Field>
        <Field label="Year of admission" hint="e.g. 2025">
          <input type="number" name="admission_year" required min={1950} max={2100} className={inputClass} />
        </Field>
      </div>

      <ImageInput name="photo" label="Your photo (optional, with your face clearly visible)" />

      <fieldset className="border-t pt-5">
        <legend className="pr-3 text-sm font-semibold">Contact details (optional)</legend>
        <p className="text-sm text-muted-foreground mb-4">
          Anything you add here will be visible to everyone on the website, so juniors can reach you for advice.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Phone">
            <input type="tel" name="phone" maxLength={30} autoComplete="tel" className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" name="email" maxLength={120} autoComplete="email" className={inputClass} />
          </Field>
          <Field label="Facebook link">
            <input name="facebook" maxLength={300} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="consent" required className="w-4 h-4 mt-1 shrink-0" />
        <span className="text-sm">
          These details are correct, and I agree to my name, photo and the details above being shown on this website.
        </span>
      </label>

      <FormError error={error} />

      <button
        type="submit"
        disabled={pending || !ready}
        className="w-full sm:w-auto px-7 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send for approval"}
      </button>
    </form>
  );
}
