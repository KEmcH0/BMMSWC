import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Committee | BMMSWC",
  description: "Meet the executive committee leading BMMSWC.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
