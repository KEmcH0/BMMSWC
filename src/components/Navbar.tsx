"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Languages, Menu, X, Moon, Sun } from "lucide-react";
import { dict, localePath, type Lang } from "@/lib/i18n";

export default function Navbar({ lang, languageSwitch }: { lang: Lang; languageSwitch: boolean }) {
  const t = dict[lang].nav;
  const navLinks = [
    { name: t.home, href: "/" },
    { name: t.about, href: "/about" },
    { name: t.committee, href: "/committee" },
    { name: t.advisors, href: "/advisors" },
    { name: t.news, href: "/news" },
    { name: t.results, href: "/results" },
    { name: t.achievers, href: "/achievers" },
    { name: t.gallery, href: "/gallery" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  // The page's address without its language; English pages are served from /en behind the scenes.
  const pathname = usePathname().replace(/^\/(en|bn)(?=\/|$)/, "") || "/";

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
      aria-label={t.toggleTheme}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );

  const otherLang = lang === "en" ? "bn" : "en";
  const languageLink = languageSwitch && (
    <Link
      href={localePath(otherLang, pathname)}
      lang={otherLang}
      hrefLang={otherLang}
      aria-label={t.switchLanguageLabel}
      className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-primary dark:hover:text-white hover:bg-muted transition-colors"
    >
      <Languages className="h-4 w-4" /> {t.switchLanguage}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all ${
        scrolled ? "bg-card/90 backdrop-blur-md shadow-sm" : "bg-card"
      }`}
    >
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-6">
        <Link href={localePath(lang, "/")} className="flex items-center gap-3 shrink-0">
          <Image src="/logo.png" alt={t.logoAlt} width={44} height={44} className="rounded-full" priority />
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold text-primary dark:text-white">BMMSWC</span>
            <span className="hidden sm:block text-[11px] text-muted-foreground tracking-wide">
              {dict[lang].shortOrgName}
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={localePath(lang, link.href)}
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
          {languageLink}
          {themeButton}
          <Link
            href={localePath(lang, "/contact")}
            className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            {t.contact}
          </Link>
        </div>

        {/* Mobile */}
        <div className="xl:hidden flex items-center gap-1">
          {languageLink}
          {themeButton}
          <button
            className="p-2 rounded-full text-foreground hover:bg-muted"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t.closeMenu : t.openMenu}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="xl:hidden border-t bg-card">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            {[...navLinks, { name: t.contact, href: "/contact" }].map((link) => (
              <Link
                key={link.href}
                href={localePath(lang, link.href)}
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
