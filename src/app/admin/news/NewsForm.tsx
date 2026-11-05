"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { NewsItem } from "@/lib/db";
import { saveNews } from "./actions";

const CATEGORIES = ["News", "Education", "Workshop", "Event", "Notice", "Cultural", "Sports"];

export default function NewsForm({ item }: { item?: NewsItem }) {
  const [error, action] = useActionState(saveNews, null);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5 max-w-3xl">
      {item && <input type="hidden" name="id" value={item.id} />}

      <Field label="Title">
        <input name="title" required defaultValue={item?.title} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Date" hint="Future date = shows under “Upcoming Events”.">
          <input type="date" name="date" required defaultValue={item?.date ?? today} className={inputClass} />
        </Field>
        <Field label="Category">
          <input name="category" list="news-categories" defaultValue={item?.category ?? "News"} className={inputClass} />
          <datalist id="news-categories">
            {CATEGORIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>
      </div>

      <Field label="Details" hint="Leave an empty line between paragraphs. Links starting with https:// become clickable.">
        <textarea name="body" rows={10} defaultValue={item?.body} className={inputClass} />
      </Field>

      <fieldset className="border-t pt-5 space-y-5">
        <legend className="pr-3 text-sm font-semibold">Bangla (optional)</legend>
        <p className="text-sm text-muted-foreground">Left empty, the Bangla website shows the English text above.</p>
        <Field label="বাংলা শিরোনাম">
          <input name="title_bn" lang="bn" defaultValue={item?.title_bn} className={inputClass} />
        </Field>
        <Field label="বাংলা বিবরণ">
          <textarea name="body_bn" lang="bn" rows={10} defaultValue={item?.body_bn} className={inputClass} />
        </Field>
      </fieldset>

      <ImageInput name="image" current={item?.image_url} label="Cover photo" />

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} className="w-4 h-4" />
        <span className="text-sm font-medium">Published (visible on the website)</span>
      </label>

      <FormError error={error} />
      <SubmitButton>{item ? "Save changes" : "Publish news"}</SubmitButton>
    </form>
  );
}
