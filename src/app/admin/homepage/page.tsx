import { AdminHeader, DeleteButton } from "@/components/admin/ui";
import { getSetting } from "@/lib/db";
import { resetHero } from "./actions";
import HeroForm from "./HeroForm";

export default async function AdminHomepage() {
  const hero = await getSetting("hero_image");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <AdminHeader title="Homepage" />

        <div className="bg-card border rounded-lg p-6 space-y-5">
          <div>
            <h2 className="text-lg font-semibold mb-1">Top image</h2>
            <p className="text-sm opacity-70">
              The large photo behind the title at the top of the homepage. A wide group photo works best; the left side is
              darkened for the text.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero || "/news/images/program2025.jpg"} alt="" className="w-full aspect-[16/7] object-cover rounded-lg" />
          {hero ? (
            <form action={resetHero}>
              <DeleteButton label="Use the default photo again" confirmText="Remove this photo and go back to the default?" />
            </form>
          ) : (
            <p className="text-sm opacity-70">Showing the default photo.</p>
          )}
          <HeroForm />
        </div>
      </div>
    </div>
  );
}
