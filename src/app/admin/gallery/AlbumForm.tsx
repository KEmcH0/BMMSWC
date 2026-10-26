"use client";

import { useActionState } from "react";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Album } from "@/lib/db";
import { saveAlbum } from "./actions";

export default function AlbumForm({ album, news }: { album?: Album; news: { id: string; title: string }[] }) {
  const [error, action] = useActionState(saveAlbum, null);

  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5">
      {album && <input type="hidden" name="id" value={album.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-5">
        <Field label="Album name">
          <input name="title" required defaultValue={album?.title} placeholder="Merit Test 2025" className={inputClass} />
        </Field>
        <Field label="Event date">
          <input type="date" name="event_date" defaultValue={album?.event_date ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Description (optional)">
        <textarea name="description" rows={2} defaultValue={album?.description} className={inputClass} />
      </Field>

      <Field label="Related news (optional)" hint="The album is shown at the bottom of that news page.">
        <select name="news_id" defaultValue={album?.news_id ?? ""} className={inputClass}>
          <option value="">— None —</option>
          {news.map((n) => (
            <option key={n.id} value={n.id}>{n.title}</option>
          ))}
        </select>
      </Field>

      <FormError error={error} />
      <SubmitButton>{album ? "Save" : "Create album"}</SubmitButton>
    </form>
  );
}
