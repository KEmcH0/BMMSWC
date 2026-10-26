import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Organization",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Executive Committee", href: "/committee" },
      { name: "Advisors", href: "/advisors" },
      { name: "Alumni", href: "/alumni" },
    ],
  },
  {
    title: "Activities",
    links: [
      { name: "News & Events", href: "/news" },
      { name: "Exam Results", href: "/results" },
      { name: "Photo Gallery", href: "/gallery" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-primary-dark text-white mt-auto overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-60" aria-hidden />
      <div className="container relative mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-10">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <Image src="/logo.png" alt="" width={48} height={48} className="rounded-full bg-white p-0.5" />
              <span className="font-display text-2xl font-semibold">{site.name}</span>
            </Link>
            <p className="text-white/65 leading-relaxed max-w-sm">
              {site.fullName}. Working for the educational and social welfare of the community since {site.founded}.
            </p>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-secondary hover:text-primary-dark transition-colors"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-secondary mb-5">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-secondary mb-5">Get in Touch</h3>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-secondary" />
                <span>{site.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-secondary" />
                <a href={site.phoneHref} className="hover:text-white transition-colors">{site.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-secondary" />
                <a href={`mailto:${site.email}`} className="hover:text-white transition-colors break-all">{site.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Developed by Fahmid Hasan</p>
        </div>
      </div>
    </footer>
  );
}
