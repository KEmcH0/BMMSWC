import { notFound } from "next/navigation";

// Sends unknown addresses to the not-found page, inside the normal site layout.
export default function UnknownPage() {
  notFound();
}
