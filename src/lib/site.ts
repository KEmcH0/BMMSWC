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
  fullName: "Fahmid Hasan Tuhin",
  photo: "/developer/fahmid.jpg",
  facebook: "https://www.facebook.com/profile.php?id=100088108552227",
  linkedin: "https://www.linkedin.com/in/fahmid-hasan-tuhin-9b9a8a274/",
  instagram: "https://www.instagram.com/fahmidhasan420/",
  github: "https://github.com/KEmcHO-0",
  codeforces: "https://codeforces.com/profile/KEmcH_O",
  email: "fahmidtuhin.79@gmail.com",
  location: "Maulvi Bazar, Sylhet, Bangladesh",

  // Everything below is shown on the /developer page. Empty fields and lists are hidden.
  role: "CSE Student · AI Trainer · Web Developer",
  bio: "Native Bangla speaker and final-year CSE student at Shahjalal University of Science and Technology (SUST). AI trainer on Outlier, evaluating Bangla speech-to-speech and TTS models with consistently high quality ratings. Researching low-resource neural machine translation between Bangla and romanized Manipuri, with a 2,000-pair parallel dataset built from scratch.",
  experience: [
    {
      title: "AI Trainer – Bangla Speech & Voice Evaluation",
      org: "Outlier (Scale AI), Remote",
      period: "Jul 2026 – Present",
      points: [
        "Evaluate Bangla speech-to-speech (S2S) voice models through live multi-turn conversations, comparing two models side by side",
        "Rate responses on naturalness, utility, conversational dynamics, audio quality and task success against detailed rubrics",
        "Flag errors with severity levels: wrong language, wrong accent or regional variant, ASR misunderstanding, hallucination, failed correction, instruction following and latency",
        "Assess Bangla TTS output for pronunciation, prosody, fluency and nativeness",
        "Write clear, evidence-based English rationales for every judgment; maintain consistently high quality ratings",
      ],
    },
  ],
  research: [
    {
      title: "Low-Resource Neural Machine Translation: Bangla ↔ Romanized Manipuri",
      org: "Undergraduate Thesis, SUST",
      period: "2026 – Present",
      points: [
        "Researching NMT between Bangla and code-mixed romanized Manipuri (Meitei), a low-resource language with very little digital data",
        "Built a parallel dataset of around 2,000 Bangla–romanized Manipuri word pairs; data collection is complete",
        "Next phase: data cleaning, train/validation/test split and fine-tuning multilingual pretrained models (e.g. NLLB via HuggingFace)",
        "Aims to build language technology for the Meitei Pangal (Manipuri Muslim) community",
      ],
    },
  ],
  projects: [
    {
      name: "দাবি.com – Student Demand Platform",
      description:
        "Full-stack MERN app where SUST students submit and track demands by category and priority, with file uploads, anonymous posting, comments and support votes. Committee dashboard with search, status updates and analytics; JWT auth, role-based access and email notifications.",
      tags: ["MongoDB", "Express", "React", "Node.js"],
      href: "",
    },
    {
      name: "BMMSWC Community Website",
      description:
        "Official website of the Bangladesh Manipuri Muslim Student Welfare Community: news, merit test results with toppers' photos, committee, photo albums and dark mode, managed from an admin dashboard.",
      tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
      href: "/",
    },
    {
      name: "Personal CV Website",
      description: "Responsive portfolio with dark/light mode, hosted on GitHub Pages.",
      tags: ["HTML", "CSS", "JavaScript"],
      href: "",
    },
    {
      name: "Carrom Scoring App",
      description: "React app tracking pairwise match results.",
      tags: ["React"],
      href: "",
    },
  ],
  skills: [
    {
      group: "AI training",
      items: ["Speech & voice model evaluation", "Side-by-side comparison", "Rubric-based rating", "Error annotation", "Written rationales", "TTS quality assessment"],
    },
    {
      group: "Programming",
      items: ["C++", "Java", "Python", "JavaScript", "TypeScript", "HTML/CSS", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "SQL (PostgreSQL)", "Bash"],
    },
    { group: "ML / NLP", items: ["HuggingFace Transformers", "Google Colab"] },
    { group: "Problem solving", items: ["Competitive programming", "Codeforces", "LeetCode"] },
    { group: "Languages", items: ["Bangla (native)", "English (professional working)", "Manipuri / Meitei (romanized)"] },
  ],
  education: [
    {
      degree: "B.Sc. in Computer Science and Engineering",
      school: "Shahjalal University of Science and Technology (SUST), Sylhet",
      period: "Final year",
    },
  ],
  certifications: [
    "Node.js (course badge) and GitHub Copilot · Codédex",
    "Relational Databases Certification (in progress; SQL, PostgreSQL and Bash modules completed) · freeCodeCamp",
  ],
};

export function classLabel(key: string) {
  return site.resultClasses.find((c) => c.key === key)?.label ?? `Class ${key}`;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
