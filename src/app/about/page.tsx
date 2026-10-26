import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Eye, Target } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | BMMSWC",
  description: "History, mission and vision of the Bangladesh Manipuri Muslim Student Welfare Community.",
};

const objectives = [
  "Promote higher education among community students.",
  "Provide financial assistance to underprivileged meritorious students.",
  "Organize skill development workshops and career counseling.",
  "Maintain and promote the rich cultural heritage of Manipuri Muslims.",
  "Foster brotherhood and leadership skills.",
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow={`Since ${site.founded}`} title="About BMMSWC" description={site.fullName} />

      {/* History */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <SectionHeading eyebrow="Our History" title="From a small initiative to a strong community" />
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Founded in {site.founded}, the Bangladesh Manipuri Muslim Student Welfare Community (BMMSWC) started as a
              small initiative to connect Manipuri Muslim students studying across Bangladesh. Today, it has grown into a
              strong community dedicated to educational advancement and social welfare.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/news/images/seminar.jpeg"
              alt="Higher studies seminar"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="py-20 bg-muted/60">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "To empower Manipuri Muslim students by facilitating educational opportunities, fostering unity, and providing a platform for personal and professional development while preserving our cultural identity.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              text: "To build a highly educated, socially responsible, and economically established community that contributes positively to the nation.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-card border rounded-2xl p-8 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mb-6">
                <Icon className="w-7 h-7" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-primary dark:text-white mb-3">{title}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading align="center" eyebrow="What Guides Us" title="Objectives & values" />
          <ul className="mt-12 grid sm:grid-cols-2 gap-4">
            {objectives.map((o) => (
              <li key={o} className="flex items-start gap-3 bg-card border rounded-xl p-5">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
