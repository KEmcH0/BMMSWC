import { getPeople } from "@/lib/db";
import AdvisorsView from "./AdvisorsView";

export const dynamic = "force-dynamic";

export default async function Advisors() {
  return <AdvisorsView advisors={await getPeople("advisor")} />;
}
