import Image from "next/image";

// Round photo; falls back to initials when no photo has been uploaded.
export default function Avatar({
  src,
  name,
  size,
  className = "",
}: {
  src: string;
  name: string;
  size: number; // rendered size in px, used for the image `sizes` hint
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    // Skip abbreviations like "Md." or "মো:" so initials come from the actual name.
    .filter((w) => w && !/[.:]$/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`relative rounded-full overflow-hidden bg-primary/10 shrink-0 ${className}`}>
      {src ? (
        <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-primary dark:text-secondary"
          style={{ fontSize: size / 3 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
