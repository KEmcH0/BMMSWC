"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Committee", href: "/committee" },
  { name: "Advisors", href: "/advisors" },
  { name: "Alumni", href: "/alumni" },
  { name: "News & Events", href: "/news" },
  { name: "Results", href: "/results" },
  { name: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const themeButton = (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all ${
        scrolled ? "bg-card/90 backdrop-blur-md shadow-sm" : "bg-card"
      }`}
    >
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image src="/logo.png" alt="BMMSWC logo" width={44} height={44} className="rounded-full" priority />
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold text-primary dark:text-white">BMMSWC</span>
            <span className="hidden sm:block text-[11px] text-muted-foreground tracking-wide">
              Manipuri Muslim Student Welfare Community
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href) ? "text-primary dark:text-white" : "text-muted-foreground hover:text-primary dark:hover:text-white"
              }`}
            >
              {link.name}
              {isActive(link.href) && (
                <span className="absolute left-3 right-3 -bottom-[17px] h-[3px] rounded-full bg-secondary" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-2">
          {themeButton}
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile */}
        <div className="xl:hidden flex items-center gap-1">
          {themeButton}
          <button
            className="p-2 rounded-full text-foreground hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden border-t bg-card">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            {[...navLinks, { name: "Contact Us", href: "/contact" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-3 rounded-lg text-base font-medium ${
                  isActive(link.href) ? "bg-muted text-primary dark:text-white" : "text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
