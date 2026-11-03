import type { Metadata } from "next";
import { getAchievers } from "@/lib/db";
import AchieversView from "./AchieversView";

export const metadata: Metadata = {
  title: "Achievers | BMMSWC",
  description: "Students from our community who earned a place at universities, medical and engineering colleges.",
};

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function Achievers() {
  return <AchieversView achievers={await getAchievers()} />;
}
