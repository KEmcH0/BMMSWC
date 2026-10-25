export type NewsItem = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: string;
  desc: string;
  img: string;
};

// Keep newest first.
export const newsItems: NewsItem[] = [
  {
    slug: "merit-test-2025",
    title: "BMMSWC Merit Test–2025",
    date: "2025-12-25",
    category: "Education",
    desc: "Out of more than 200 exceptional students who participated in the BMMSWC Merit Test–2025, today we honor the best of the best. Congratulations to our meritorious achievers on this well-deserved success!",
    img: "/news/images/exam.jpg",
  },
  {
    slug: "meritorious-student-reception-2025",
    title: "Meritorious Student Reception",
    date: "2025-12-02",
    category: "Education",
    desc: "Hard work, resilience, and pure dedication—all under one roof today! We are incredibly proud to host the Meritorious Student Reception and Prize Giving Ceremony to honor our top achievers.",
    img: "/news/images/songbordhona.jpg",
  },
  {
    slug: "higher-studies-seminar-2025",
    title: "Higher Studies Seminar 2025",
    date: "2025-10-03",
    category: "Workshop",
    desc: "Charting the path to global success at the Higher Studies Seminar 2025! This event brings together ambitious minds to explore academic pathways, scholarship opportunities, and career-defining choices. Your journey to the world's top universities begins right here!",
    img: "/news/images/seminar.jpeg",
  },
];

export function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getNewsBySlug(slug: string) {
  return newsItems.find((item) => item.slug === slug);
}
