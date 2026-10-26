"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { Field, FormError, SubmitButton, inputClass } from "@/components/admin/ui";
import { uploadGallery } from "./actions";

export default function UploadForm() {
  const [error, action, pending] = useActionState(uploadGallery, null);

  // React resets the form after the action finishes; the key remount clears the photo previews too.
  return (
    <form action={action} className="bg-card border rounded-lg p-6 space-y-5 mb-8">
      <h2 className="text-lg font-semibold">Upload photos</h2>
      <ImageInput name="photos" multiple label="Photos" key={pending ? "uploading" : "idle"} />
      <Field label="Caption (optional, applies to all photos in this upload)">
        <input name="caption" className={inputClass} placeholder="e.g. Merit Test 2025" />
      </Field>
      <FormError error={error} />
      <SubmitButton>Upload</SubmitButton>
    </form>
  );
}
