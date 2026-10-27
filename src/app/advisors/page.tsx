import { getPeople } from "@/lib/db";
import AdvisorsView from "./AdvisorsView";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function Advisors() {
  return <AdvisorsView advisors={await getPeople("advisor")} />;
}
