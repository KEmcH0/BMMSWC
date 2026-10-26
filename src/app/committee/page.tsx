import { getPeople } from "@/lib/db";
import CommitteeView from "./CommitteeView";

export const dynamic = "force-dynamic";

export default async function Committee() {
  return <CommitteeView members={await getPeople("committee")} />;
}
