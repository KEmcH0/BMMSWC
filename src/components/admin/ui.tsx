"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

export const inputClass =
  "w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary";

export function AdminHeader({ title, back = "/admin", children }: { title: string; back?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <Link href={back} className="text-primary hover:underline">← Back</Link>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs opacity-60 mt-1">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-60 ${className}`}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function DeleteButton({ label = "Delete", confirmText = "Delete this permanently?" }: { label?: string; confirmText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-60"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return <p className="text-red-600 text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-3">{error}</p>;
}
