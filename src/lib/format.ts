export function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Today's date in Bangladesh (UTC+6) as YYYY-MM-DD.
export function todayInDhaka() {
  return new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 10);
}
