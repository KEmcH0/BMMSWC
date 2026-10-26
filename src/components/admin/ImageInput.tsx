"use client";

import { useState } from "react";

const MAX_SIDE = 1600;

// Shrinks a photo in the browser before upload, so phone photos (3–8 MB) become ~300 KB JPEGs.
async function resize(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export default function ImageInput({
  name,
  current,
  multiple = false,
  label = "Photo",
}: {
  name: string;
  current?: string;
  multiple?: boolean;
  label?: string;
}) {
  const [previews, setPreviews] = useState<string[]>(current ? [current] : []);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []).slice(0, multiple ? 10 : 1);
    if (!files.length) return;
    setBusy(true);
    try {
      const resized = await Promise.all(files.map(resize));
      const dt = new DataTransfer();
      resized.forEach((f) => dt.items.add(f));
      input.files = dt.files;
      setPreviews(resized.map((f) => URL.createObjectURL(f)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {previews.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-24 w-24 object-cover rounded-lg border" />
          ))}
        </div>
      )}
      <input
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        onChange={onChange}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
      />
      {busy && <p className="text-xs opacity-70 mt-1">Preparing image…</p>}
      {multiple && <p className="text-xs opacity-60 mt-1">Up to 10 photos at a time.</p>}
    </div>
  );
}
