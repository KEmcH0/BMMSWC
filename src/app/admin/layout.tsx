import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Admin | BMMSWC",
  robots: { index: false, follow: false },
};

// The admin stays in English.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootDocument lang="en" languageSwitch={false}>
      {children}
    </RootDocument>
  );
}
