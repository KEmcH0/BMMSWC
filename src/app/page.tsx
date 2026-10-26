import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HandHeart,
  Landmark,
  Mail,
  Phone,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";

import HomeGallerySection from "./HomeGallerySection";
import NewsCard from "@/components/NewsCard";
import Avatar from "@/components/Avatar";
import { countPeople, getGallery, getNews, getPeople } from "@/lib/db";
import { site } from "@/lib/site";

const FOUNDED = site.founded;


const programs = [
  {
    icon: GraduationCap,
    title: "Higher Education",
    desc: "Promoting higher education among community students through merit tests, seminars and guidance.",
  },
  {
    icon: HandHeart,
    title: "Financial Assistance",
    desc: "Supporting underprivileged meritorious students so that no talent is left behind.",
  },
  {
    icon: BookOpen,
    title: "Skills & Career",
    desc: "Skill development workshops and career counseling for students and young graduates.",
  },
  {
    icon: Landmark,
    title: "Culture & Heritage",
    desc: "Preserving and promoting the rich cultural heritage of Manipuri Muslims.",
  },
];

const leaderPositions = ["President", "General Secretary"];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [committee, advisorCount, latestNews, gallery] = await Promise.all([
    getPeople("committee"),
    countPeople("advisor"),
    getNews({ limit: 3 }),
    getGallery(24),
  ]);
  const galleryImages = gallery.map((g) => g.image_url);

  const stats = [
    { value: `${new Date().getFullYear() - FOUNDED}+`, label: "Years of Service" },
    { value: "200+", label: "Merit Test 2025 Participants" },
    { value: `${committee.length}`, label: "Committee Members" },
    { value: `${advisorCount}`, label: "Advisors" },
  ];

  const leaders = leaderPositions.flatMap((p) => committee.filter((m) => m.position === p));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/news/images/program2025.jpg')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-secondary font-bold tracking-wider">EST. {FOUNDED}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">
            Bangladesh Manipuri Muslim <br className="hidden md:block" />
            <span className="text-secondary">Student Welfare Community</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10">
            Empowering students, preserving heritage, and building a stronger community through education, unity, and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/about"
              className="px-8 py-3 bg-secondary text-primary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
            >
              Learn More <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/news"
              className="px-8 py-3 border-2 border-white/70 text-white font-semibold rounded-full hover:bg-white/10 transition-all flex items-center justify-center"
            >
              Latest News
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-card border rounded-2xl shadow-lg divide-x divide-y lg:divide-y-0 overflow-hidden">
          {stats.map((s) => (
            <div key={s.label} className="p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
              <div className="text-sm opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">What We Do</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border rounded-2xl p-6 hover:shadow-md hover:border-secondary/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm opacity-75 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-4">Latest News & Events</h2>
                <div className="w-24 h-1 bg-secondary rounded-full" />
              </div>
              <Link href="/news" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Leadership */}
      {leaders.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Our Leadership</h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-10 mb-10">
              {leaders.map((m) => (
                <div key={m.id} className="flex flex-col items-center text-center">
                  <Avatar src={m.photo_url} name={m.name} size={144} className="w-36 h-36 border-4 border-secondary mb-4 shadow-sm" />
                  <h3 className="text-xl font-bold text-primary">{m.name}</h3>
                  <p className="text-secondary font-medium">{m.position}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/committee"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Meet the Full Committee <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <HomeGallerySection galleryImages={galleryImages} />

      {/* Call to action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-3xl p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of Our Journey</h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-8">
              Join our programs, support a student, or simply stay connected with the community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary text-primary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <FaFacebook className="w-5 h-5" /> Follow on Facebook
              </a>
              <a
                href={site.phoneHref}
                className="px-6 py-3 border-2 border-white/70 font-semibold rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" /> Call Us
              </a>
              <a
                href={`mailto:${site.email}`}
                className="px-6 py-3 border-2 border-white/70 font-semibold rounded-full hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
