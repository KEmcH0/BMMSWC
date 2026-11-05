import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, BriefcaseBusiness, FlaskConical, GraduationCap, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import { developer } from "@/lib/site";

export const metadata: Metadata = {
  title: `${developer.fullName} | Portfolio`,
  description: developer.bio,
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold text-primary dark:text-white">{title}</h2>
    </div>
  );
}

// Experience and research share the same timeline card.
function TimelineCard({
  icon: Icon,
  item,
}: {
  icon: typeof BriefcaseBusiness;
  item: { title: string; org: string; period: string; points: string[] };
}) {
  return (
    <article className="relative bg-card border rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-primary text-secondary flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-6">
            <h3 className="text-lg md:text-xl font-semibold text-primary dark:text-white">{item.title}</h3>
            <span className="text-sm font-medium text-secondary whitespace-nowrap">{item.period}</span>
          </div>
          <p className="text-muted-foreground italic">{item.org}</p>
          <ul className="mt-4 space-y-2">
            {item.points.map((point) => (
              <li key={point} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function DeveloperPage() {
  const links = [
    { href: developer.github, label: "GitHub", Icon: FaGithub },
    { href: developer.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
    { href: developer.codeforces, label: "Codeforces", Icon: SiCodeforces },
    { href: developer.facebook, label: "Facebook", Icon: FaFacebookF },
    { href: developer.instagram, label: "Instagram", Icon: FaInstagram },
  ].filter((l) => l.href);

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
              alt={developer.fullName}
              width={200}
              height={200}
              priority
              className="h-44 w-44 md:h-52 md:w-52 rounded-full object-cover ring-4 ring-secondary"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="eyebrow mb-4">{developer.role}</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold">{developer.fullName}</h1>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-white/75">
              {developer.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" /> {developer.location}
                </span>
              )}
              {developer.email && (
                <a href={`mailto:${developer.email}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail className="w-4 h-4 text-secondary" /> {developer.email}
                </a>
              )}
            </div>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
              {developer.email && (
                <a
                  href={`mailto:${developer.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-primary-dark font-semibold hover:brightness-110 transition"
                >
                  <Mail className="w-4 h-4" /> Contact me
                </a>
              )}
              {links.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-secondary hover:text-primary-dark transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-20 space-y-20 max-w-5xl">
        {developer.bio && (
          <section>
            <SectionTitle eyebrow="About" title="Summary" />
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{developer.bio}</p>
          </section>
        )}

        {developer.experience.length > 0 && (
          <section>
            <SectionTitle eyebrow="Experience" title="Where I work" />
            <div className="space-y-6">
              {developer.experience.map((item) => (
                <TimelineCard key={item.title} icon={BriefcaseBusiness} item={item} />
              ))}
            </div>
          </section>
        )}

        {developer.research.length > 0 && (
          <section>
            <SectionTitle eyebrow="Research" title="What I'm researching" />
            <div className="space-y-6">
              {developer.research.map((item) => (
                <TimelineCard key={item.title} icon={FlaskConical} item={item} />
              ))}
            </div>
          </section>
        )}

        {developer.projects.length > 0 && (
          <section>
            <SectionTitle eyebrow="Work" title="Projects" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developer.projects.map((project) => {
                const body = (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-primary dark:text-white">{project.name}</h3>
                      {project.href && (
                        <ArrowUpRight className="w-5 h-5 text-secondary shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      )}
                    </div>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{project.description}</p>
                    {project.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-primary dark:text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                );
                const cls = "group block h-full bg-card border rounded-2xl p-7 transition-all";
                return project.href ? (
                  <Link
                    key={project.name}
                    href={project.href}
                    className={`${cls} hover:shadow-xl hover:shadow-primary/10 hover:border-secondary/60`}
                  >
                    {body}
                  </Link>
                ) : (
                  <div key={project.name} className={cls}>
                    {body}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {developer.skills.length > 0 && (
          <section>
            <SectionTitle eyebrow="Skills" title="What I work with" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {developer.skills.map(({ group, items }) => (
                <div key={group} className="bg-card border rounded-2xl p-6">
                  <h3 className="font-semibold text-primary dark:text-white mb-4">{group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span key={item} className="text-sm px-3 py-1.5 rounded-full border bg-background">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developer.education.length > 0 && (
            <section className="bg-card border rounded-2xl p-6 md:p-8">
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-primary dark:text-white mb-5">
                <GraduationCap className="w-6 h-6 text-secondary" /> Education
              </h2>
              {developer.education.map((e) => (
                <div key={e.degree}>
                  <h3 className="font-semibold">{e.degree}</h3>
                  <p className="text-muted-foreground">{e.school}</p>
                  <p className="text-sm text-secondary font-medium mt-1">{e.period}</p>
                </div>
              ))}
            </section>
          )}
          {developer.certifications.length > 0 && (
            <section className="bg-card border rounded-2xl p-6 md:p-8">
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-primary dark:text-white mb-5">
                <Award className="w-6 h-6 text-secondary" /> Certifications
              </h2>
              <ul className="space-y-3">
                {developer.certifications.map((c) => (
                  <li key={c} className="flex gap-3 text-muted-foreground">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
