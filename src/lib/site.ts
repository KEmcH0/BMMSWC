// Organization contact details, used by the footer, homepage and contact page.
export const site = {
  name: "BMMSWC",
  fullName: "Bangladesh Manipuri Muslim Student Welfare Community",
  founded: 1985,
  committeeSession: "2025–26",
  // Classes whose top 3 are shown on each exam result page. Add "12" here to show Class 12.
  resultClasses: ["5", "8", "10"],
  address: "Adampur Bazar, Moulvibazar",
  phone: "+880 1942357476",
  phoneHref: "tel:+8801942357476",
  email: "contact@bmmswc.org",
  facebook: "https://www.facebook.com/BMMCKP",
};

// Website developer credit shown at the bottom of every page. Empty links are hidden.
export const developer = {
  name: "Fahmid Hasan",
  facebook: "https://www.facebook.com/profile.php?id=100088108552227",
  linkedin: "https://www.linkedin.com/in/fahmid-hasan-tuhin-9b9a8a274/",
  instagram: "https://www.instagram.com/fahmidhasan420/",
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
