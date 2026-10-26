"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import type { Person, PersonKind } from "@/lib/db";
import { PEOPLE_CONFIG } from "./config";
import { savePerson } from "./actions";

export default function PersonForm({
  kind,
  person,
  nextOrder,
}: {
  kind: PersonKind;
  person?: Person;
  nextOrder?: number;
}) {
  const [error, action] = useActionState(savePerson, null);
  const cfg = PEOPLE_CONFIG[kind];

  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5 max-w-3xl">
      <input type="hidden" name="kind" value={kind} />
      {person && <input type="hidden" name="id" value={person.id} />}

      <Field label="Name">
        <input name="name" required defaultValue={person?.name} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-5">
        <Field label={cfg.positionLabel}>
          <input name="position" list={`positions-${kind}`} defaultValue={person?.position} className={inputClass} />
          {cfg.positions && (
            <datalist id={`positions-${kind}`}>
              {cfg.positions.map((p) => <option key={p} value={p} />)}
            </datalist>
          )}
        </Field>
        <Field label="Display order" hint="Smaller number shows first.">
          <input
            type="number"
            name="sort_order"
            defaultValue={person?.sort_order ?? nextOrder ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label={cfg.bioLabel}>
        <textarea name="bio" rows={3} defaultValue={person?.bio} className={inputClass} />
      </Field>

      <ImageInput name="photo" current={person?.photo_url} />

      <FormError error={error} />
      <SubmitButton>{person ? "Save changes" : `Add ${cfg.singular}`}</SubmitButton>
    </form>
  );
}
