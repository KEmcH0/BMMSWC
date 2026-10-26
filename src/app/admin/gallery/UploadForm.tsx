"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import { uploadPhotos } from "./actions";

export default function UploadForm({ albumId }: { albumId: string }) {
  const [error, action, pending] = useActionState(uploadPhotos, null);

  // React resets the form after the action finishes; the key remount clears the photo previews too.
  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5">
      <h2 className="text-lg font-semibold">Add photos</h2>
      <input type="hidden" name="album_id" value={albumId} />
      <ImageInput name="photos" multiple label="Photos" key={pending ? "uploading" : "idle"} />
      <Field label="Caption (optional, applies to all photos in this upload)">
        <input name="caption" className={inputClass} placeholder="e.g. Prize giving ceremony" />
      </Field>
      <FormError error={error} />
      <SubmitButton>Upload</SubmitButton>
    </form>
  );
}
