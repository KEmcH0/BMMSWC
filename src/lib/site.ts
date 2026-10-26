// Organization contact details, used by the footer, homepage and contact page.
export const site = {
  name: "BMMSWC",
  fullName: "Bangladesh Manipuri Muslim Student Welfare Community",
  founded: 1985,
  committeeSession: "2025–26",
  // Result sections, each with its own top 3. Class 12 is split by group.
  resultClasses: [
    { key: "5", label: "Class 5" },
    { key: "8", label: "Class 8" },
    { key: "10", label: "Class 10" },
    { key: "12-science", label: "Class 12 · Science" },
    { key: "12-arts", label: "Class 12 · Arts" },
    { key: "12-commerce", label: "Class 12 · Commerce" },
  ],
  address: "Adampur Bazar, Moulvibazar",
  phone: "+880 1942357476",
  phoneHref: "tel:+8801942357476",
  // Leave empty until the organization has a working address; empty hides it everywhere.
  email: "",
  facebook: "https://www.facebook.com/BMMCKP",
};

// Website developer credit shown at the bottom of every page. Empty links are hidden.
export const developer = {
  name: "Fahmid Hasan",
  photo: "/developer/fahmid.jpg",
  facebook: "https://www.facebook.com/profile.php?id=100088108552227",
  linkedin: "https://www.linkedin.com/in/fahmid-hasan-tuhin-9b9a8a274/",
  instagram: "https://www.instagram.com/fahmidhasan420/",
};

export function classLabel(key: string) {
  return site.resultClasses.find((c) => c.key === key)?.label ?? `Class ${key}`;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
