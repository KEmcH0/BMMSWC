import { getPeople } from "@/lib/db";
import AlumniView from "./AlumniView";

export const dynamic = "force-dynamic";

export default async function Alumni() {
  return <AlumniView alumni={await getPeople("alumni")} />;
}
