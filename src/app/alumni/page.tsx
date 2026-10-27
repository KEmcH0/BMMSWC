import { getPeople } from "@/lib/db";
import AlumniView from "./AlumniView";

// Served from cache; admin changes refresh it right away (revalidatePublicSite), this is only a safety net.
export const revalidate = 3600;

export default async function Alumni() {
  return <AlumniView alumni={await getPeople("alumni")} />;
}
