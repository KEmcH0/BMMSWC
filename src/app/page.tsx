import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HandHeart,
  Landmark,
  Mail,
  Phone,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";

import HomeGallerySection from "./HomeGallerySection";
import Avatar from "@/components/Avatar";
import NewsCard from "@/components/NewsCard";
import SectionHeading from "@/components/SectionHeading";
import { countPeople, getGallery, getNews, getPeople } from "@/lib/db";
import { site } from "@/lib/site";

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

const highlights = [
  "Annual merit test and prize-giving for meritorious students",
  "Higher studies seminars and career guidance",
  "Financial support for underprivileged students",
];

const leaderPositions = ["President", "General Secretary"];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [committee, advisorCount, latestNews, gallery] = await Promise.all([
    getPeople("committee"),
    countPeople("advisor"),
    getNews({ limit: 3 }),
    getGallery(5),
  ]);

  const stats = [
    { value: `${new Date().getFullYear() - site.founded}+`, label: "Years of Service" },
    { value: "200+", label: "Merit Test 2025 Participants" },
    { value: `${committee.length}`, label: "Committee Members" },
    { value: `${advisorCount}`, label: "Honorable Advisors" },
  ];

  const leaders = leaderPositions.flatMap((p) => committee.filter((m) => m.position === p));

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-primary-dark text-white">
        <Image
          src="/news/images/program2025.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/75 to-primary-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <p className="eyebrow mb-6">Since {site.founded} · Moulvibazar, Bangladesh</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1]">
              Empowering students.
              <br />
              <span className="text-secondary">Preserving heritage.</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed">
              {site.fullName} builds a stronger community through education, unity and excellence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/results"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-secondary text-primary-dark font-semibold hover:brightness-110 transition"
              >
                Merit Test Results <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/40 font-semibold hover:bg-white/10 transition"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-14 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-card border rounded-2xl shadow-xl shadow-primary/5 overflow-hidden">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-6 py-8 text-center ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${
                i === 2 ? "lg:border-l" : ""
              }`}
            >
              <div className="font-display text-4xl font-semibold text-primary dark:text-white">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="py-24">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-secondary/60" aria-hidden />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/news/images/songbordhona.jpg"
                alt="Meritorious student reception"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Who We Are" title="A community built on education and unity" />
            <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
              Founded in {site.founded}, BMMSWC started as a small initiative to connect Manipuri Muslim students
              studying across Bangladesh. Today it is a strong community dedicated to educational advancement and
              social welfare.
            </p>
            <ul className="mt-8 space-y-4">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 font-semibold text-primary dark:text-white hover:gap-3 transition-all"
            >
              Learn more about us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-24 bg-muted/60">
        <div className="container mx-auto px-4">
          <SectionHeading
            align="center"
            eyebrow="What We Do"
            title="Our programs"
            description="Everything we do is aimed at helping students reach their full potential."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-card border rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-primary-dark transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <SectionHeading eyebrow="Stay Updated" title="Latest news & events" />
              <Link
                href="/news"
                className="inline-flex items-center gap-2 font-semibold text-primary dark:text-white hover:gap-3 transition-all shrink-0"
              >
                View all news <ArrowRight className="w-4 h-4" />
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
        <section className="py-24 bg-muted/60">
          <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_1.2fr] gap-14 items-center">
            <div>
              <SectionHeading
                eyebrow="Leadership"
                title={`Executive Committee ${site.committeeSession}`}
                description="Our elected committee works year-round to organise programs, support students and represent the community."
              />
              <Link
                href="/committee"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
              >
                Meet the full committee <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {leaders.map((m) => (
                <div key={m.id} className="bg-card border rounded-2xl p-8 text-center">
                  <Avatar
                    src={m.photo_url}
                    name={m.name}
                    size={144}
                    className="w-36 h-36 mx-auto ring-4 ring-secondary/70 ring-offset-4 ring-offset-card"
                  />
                  <h3 className="mt-6 text-xl font-bold">{m.name}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-secondary">{m.position}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <HomeGallerySection images={gallery.map((g) => ({ url: g.image_url, caption: g.caption }))} />

      {/* Call to action */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-white px-8 py-14 md:px-16 md:py-16">
            <div className="absolute inset-0 pattern-grid" aria-hidden />
            <div className="absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" aria-hidden />
            <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold">Be part of our journey</h2>
                <p className="mt-4 text-white/75 max-w-xl">
                  Join our programs, support a student, or simply stay connected with the community.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-secondary text-primary-dark font-semibold hover:brightness-110 transition"
                >
                  <FaFacebookF className="w-4 h-4" /> Follow us
                </a>
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 font-semibold hover:bg-white/10 transition"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/40 font-semibold hover:bg-white/10 transition"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
