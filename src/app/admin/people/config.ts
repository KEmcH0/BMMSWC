import type { PersonKind } from "@/lib/db";

export const PEOPLE_CONFIG: Record<
  PersonKind,
  { title: string; singular: string; listPath: string; positionLabel: string; bioLabel: string; positions?: string[] }
> = {
  committee: {
    title: "Committee",
    singular: "member",
    listPath: "/admin/committee",
    positionLabel: "Post",
    bioLabel: "Short note (optional)",
    positions: [
      "President",
      "Vice President",
      "General Secretary",
      "Joint General Secretary",
      "Treasurer",
      "Organizing Secretary",
      "Joint Organizing Secretary",
      "Publicity Secretary",
      "Joint Publicity Secretary",
      "International Affairs Secretary",
      "Literary and Cultural Secretary",
      "Sport Secretary",
      "Office Secretary",
      "Executive Member",
    ],
  },
  advisor: {
    title: "Advisors",
    singular: "advisor",
    listPath: "/admin/advisors",
    positionLabel: "Designation",
    bioLabel: "Profession / workplace",
    positions: ["Chief Advisor", "Advisor"],
  },
  alumni: {
    title: "Alumni",
    singular: "alumnus",
    listPath: "/admin/alumni",
    positionLabel: "Batch / status",
    bioLabel: "Achievements / current work",
  },
};

export function isPersonKind(value: string): value is PersonKind {
  return value in PEOPLE_CONFIG;
}
