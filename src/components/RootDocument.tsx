import { Fraunces, Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import type { Lang } from "@/lib/i18n";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Bangla text falls back to this font.
const hind = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

// The page shell shared by the public website and the admin. They are separate root layouts so that
// <html lang> can follow the page's language.
export default function RootDocument({
  lang,
  languageSwitch,
  children,
}: {
  lang: Lang;
  languageSwitch: boolean;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${fraunces.variable} ${hind.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar lang={lang} languageSwitch={languageSwitch} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
