"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Achiever } from "@/lib/db";
import { achieverCategories } from "@/lib/site";
import { saveAchiever } from "./actions";

export default function AchieverForm({ achiever }: { achiever?: Achiever }) {
  const [error, action] = useActionState(saveAchiever, null);

  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5 max-w-3xl">
      {achiever && <input type="hidden" name="id" value={achiever.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Name">
          <input name="name" required defaultValue={achiever?.name} className={inputClass} />
        </Field>
        <Field label="Village">
          <input name="village" required defaultValue={achiever?.village} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5">
        <Field label="Type">
          <select name="category" required defaultValue={achiever?.category ?? ""} className={inputClass}>
            <option value="" disabled>Choose…</option>
            {achieverCategories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="University / college" hint="e.g. Sylhet MAG Osmani Medical College">
          <input name="institution" required defaultValue={achiever?.institution} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Subject" hint="e.g. MBBS, CSE, English">
          <input name="subject" defaultValue={achiever?.subject} className={inputClass} />
        </Field>
        <Field label="Session" hint="e.g. 2023-24">
          <input name="session" defaultValue={achiever?.session} className={inputClass} />
        </Field>
        <Field label="Year of admission">
          <input
            type="number"
            name="admission_year"
            required
            min={1950}
            max={2100}
            defaultValue={achiever?.admission_year ?? new Date().getFullYear()}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Phone (optional)">
          <input type="tel" name="phone" defaultValue={achiever?.phone} className={inputClass} />
        </Field>
        <Field label="Email (optional)">
          <input type="email" name="email" defaultValue={achiever?.email} className={inputClass} />
        </Field>
        <Field label="Facebook link (optional)">
          <input name="facebook" defaultValue={achiever?.facebook} className={inputClass} />
        </Field>
      </div>

      <ImageInput name="photo" current={achiever?.photo_url} />

      <FormError error={error} />
      <SubmitButton>{achiever ? "Save changes" : "Add student"}</SubmitButton>
    </form>
  );
}
