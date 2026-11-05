"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, inputClass } from "@/components/admin/ui";
import { categoryLabelFor, dict, localePath, type Lang } from "@/lib/i18n";
import { achieverCategories } from "@/lib/site";
import { submitAchiever } from "../actions";

// Keeps the request under the 4 MB limit. Photos are normally far smaller after being resized in the browser.
const MAX_PHOTO_BYTES = 3.5 * 1024 * 1024;

export default function SubmitForm({ lang }: { lang: Lang }) {
  const t = dict[lang].submit;
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
      setError(t.tooLarge);
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
        setError(t.network);
      }
    });
  }

  if (sent) {
    return (
      <div className="max-w-xl mx-auto text-center bg-card border rounded-2xl p-8 md:p-12">
        <CheckCircle2 className="w-14 h-14 mx-auto text-secondary" />
        <h2 className="mt-5 font-display text-2xl md:text-3xl font-semibold text-primary dark:text-white">{t.thanks}</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t.thanksText}
        </p>
        <Link
          href={localePath(lang, "/achievers")}
          className="mt-8 inline-flex items-center gap-2 font-semibold text-primary dark:text-white hover:gap-3 transition-all"
        >
          {t.seeAchievers} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto bg-card border rounded-2xl p-6 md:p-8 space-y-5">
      <input type="hidden" name="lang" value={lang} />

      {/* Hidden from people, but bots fill it in; see submitAchiever. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="leave_empty" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={t.name}>
          <input name="name" required maxLength={120} autoComplete="name" className={inputClass} />
        </Field>
        <Field label={t.village}>
          <input name="village" required maxLength={120} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5">
        <Field label={t.type}>
          <select name="category" required defaultValue="" className={`${inputClass} h-[42px]`}>
            <option value="" disabled>{t.choose}</option>
            {achieverCategories.map((c) => (
              <option key={c.key} value={c.key}>{categoryLabelFor(c.key, lang)}</option>
            ))}
          </select>
        </Field>
        <Field label={t.institution} hint={t.institutionHint}>
          <input name="institution" required maxLength={160} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label={t.subject} hint={t.subjectHint}>
          <input name="subject" required maxLength={100} className={inputClass} />
        </Field>
        <Field label={t.session} hint={t.sessionHint}>
          <input name="session" required maxLength={20} className={inputClass} />
        </Field>
        <Field label={t.year} hint={t.yearHint}>
          <input type="number" name="admission_year" required min={1950} max={2100} className={inputClass} />
        </Field>
      </div>

      <ImageInput name="photo" label={t.photo} />

      <fieldset className="border-t pt-5">
        <legend className="pr-3 text-sm font-semibold">{t.contact}</legend>
        <p className="text-sm text-muted-foreground mb-4">
          {t.contactNote}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label={t.phone}>
            <input type="tel" name="phone" maxLength={30} autoComplete="tel" className={inputClass} />
          </Field>
          <Field label={t.email}>
            <input type="email" name="email" maxLength={120} autoComplete="email" className={inputClass} />
          </Field>
          <Field label={t.facebook}>
            <input name="facebook" maxLength={300} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="consent" required className="w-4 h-4 mt-1 shrink-0" />
        <span className="text-sm">
          {t.consent}
        </span>
      </label>

      <FormError error={error} />

      <button
        type="submit"
        disabled={pending || !ready}
        className="w-full sm:w-auto px-7 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
