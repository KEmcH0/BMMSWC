import { getPeople } from "@/lib/db";
import CommitteeView from "./CommitteeView";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function Committee() {
  return <CommitteeView members={await getPeople("committee")} />;
}
