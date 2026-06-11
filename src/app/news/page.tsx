import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export default function News() {
  const newsItems = [
    {
      id: 1,
      title: "Meritorious Student Reception",
      date: "December 2, 2025",
      category: "Education",
      desc: "Hard work, resilience, and pure dedication—all under one roof today! We are incredibly proud to host the Meritorious Student Reception and Prize Giving Ceremony to honor our top achievers.",
      img: "news/images/songbordhona.jpg"
    },
    {
      id: 2,
      title: "Higher Studies Seminar 2025",
      date: "Octobar 3, 2025",
      category: "Workshop",
      desc: "Charting the path to global success at the Higher Studies Seminar 2025! This event brings together ambitious minds to explore academic pathways, scholarship opportunities, and career-defining choices. Your journey to the world's top universities begins right here!",
      img: "news/images/seminar.jpeg"
    },
    {
      id: 3,
      title: "BMMSWC Merit Test–2025",
      date: "December 25, 2025",
      category: "Education",
      desc: "Out of more than 200 exceptional students who participated in the BMMSWC Merit Test–2025, today we honor the best of the best. Congratulations to our meritorious achievers on this well-deserved success!",
      img: "news/images/exam.jpg"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">News & Events</h1>
        <div className="w-24 h-1 bg-secondary mx-auto rounded-full mb-6" />
        <p className="opacity-80 max-w-2xl mx-auto">
          Stay updated with the latest happenings and upcoming events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border group flex flex-col">
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {item.category}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-sm text-secondary font-medium mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> {item.date}
              </div>
              <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                {item.title}
              </h3>
              <p className="opacity-80 mb-6 line-clamp-3 text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
