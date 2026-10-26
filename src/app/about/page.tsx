import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | BMMSWC",
  description: "History, mission and vision of the Bangladesh Manipuri Muslim Student Welfare Community.",
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center border-b pb-4 border-secondary/30">About BMMSWC</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-secondary">Our History</h2>
            <p className="text-lg opacity-80 leading-relaxed">
              Founded in 1985, Bangladesh Manipuri Muslim Student Welfare Community (BMMSWC) started as a small initiative to connect Manipuri Muslim students studying across Bangladesh. Today, it has grown into a strong community dedicated to educational advancement and social welfare.
            </p>
          </section>

          <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Mission</h2>
            <p className="text-lg opacity-80 leading-relaxed">
              To empower Manipuri Muslim students by facilitating educational opportunities, fostering unity, and providing a platform for personal and professional development while preserving our cultural identity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-secondary">Vision</h2>
            <p className="text-lg opacity-80 leading-relaxed">
              To build a highly educated, socially responsible, and economically established community that contributes positively to the nation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Objectives & Values</h2>
            <ul className="list-disc list-inside space-y-3 opacity-80 text-lg ml-4">
              <li>Promote higher education among community students.</li>
              <li>Provide financial assistance to underprivileged meritorious students.</li>
              <li>Organize skill development workshops and career counseling.</li>
              <li>Maintain and promote the rich cultural heritage of Manipuri Muslims.</li>
              <li>Foster brotherhood and leadership skills.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
