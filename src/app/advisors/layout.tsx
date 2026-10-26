import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Honorable Advisors | BMMSWC",
  description: "Advisors who guide and support BMMSWC.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
