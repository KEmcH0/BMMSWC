"use client";

import { useActionState } from "react";
import ImageInput from "@/components/admin/ImageInput";
import { FormError, SubmitButton } from "@/components/admin/ui";
import { saveHero } from "./actions";

export default function HeroForm() {
  const [error, action, pending] = useActionState(saveHero, null);
  return (
    <form action={action} className="space-y-4">
      <ImageInput name="photo" label="New photo" key={pending ? "uploading" : "idle"} />
      <FormError error={error} />
      <SubmitButton>Upload</SubmitButton>
    </form>
  );
}
