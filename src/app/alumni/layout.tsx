import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni | BMMSWC",
  description: "Alumni of BMMSWC and their achievements.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
