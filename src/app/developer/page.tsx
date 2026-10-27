import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { developer } from "@/lib/site";

export const metadata: Metadata = {
  title: `${developer.name} | Developer of the BMMSWC website`,
  description: developer.bio,
};

export default function DeveloperPage() {
  const socials = [
    { href: developer.facebook, label: "Facebook", Icon: FaFacebookF },
    { href: developer.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
    { href: developer.instagram, label: "Instagram", Icon: FaInstagram },
  ].filter((s) => s.href);

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-white dark:bg-primary-dark">
        <div className="absolute inset-0 pattern-grid" aria-hidden />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" aria-hidden />
        <div className="container relative mx-auto max-w-5xl px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="relative shrink-0">
            <div className="absolute -inset-3 rounded-full border border-secondary/40" aria-hidden />
            <Image
              src={developer.photo}
              alt={developer.name}
              width={200}
              height={200}
              priority
              className="h-44 w-44 md:h-52 md:w-52 rounded-full object-cover ring-4 ring-secondary"
            />
          </div>
          <div className="text-center md:text-left">
            {developer.role && <p className="eyebrow mb-4 justify-center md:justify-start">{developer.role}</p>}
            <h1 className="font-display text-4xl md:text-6xl font-semibold">{developer.name}</h1>
            {developer.bio && <p className="mt-5 max-w-xl text-lg text-white/75 leading-relaxed">{developer.bio}</p>}
            {socials.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-secondary hover:text-primary-dark font-semibold transition-colors"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20 space-y-16 max-w-5xl">
        {developer.skills.length > 0 && (
          <section>
            <p className="eyebrow mb-3">Skills</p>
            <h2 className="font-display text-3xl font-semibold text-primary dark:text-white mb-8">What I work with</h2>
            <div className="flex flex-wrap gap-3">
              {developer.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border font-medium">
                  <Code2 className="w-4 h-4 text-secondary" /> {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {developer.projects.length > 0 && (
          <section>
            <p className="eyebrow mb-3">Work</p>
            <h2 className="font-display text-3xl font-semibold text-primary dark:text-white mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developer.projects.map((project) => (
                <Link
                  key={project.name}
                  href={project.href}
                  className="group bg-card border rounded-2xl p-7 hover:shadow-xl hover:shadow-primary/10 hover:border-secondary/60 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl font-semibold text-primary dark:text-white">{project.name}</h3>
                    <ArrowUpRight className="w-5 h-5 text-secondary shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{project.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
