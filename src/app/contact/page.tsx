import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { site } from "@/lib/site";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Contact Us | BMMSWC",
  description: `Get in touch with ${site.fullName}.`,
};

const channels = [
  { icon: Phone, label: "Phone", value: site.phone, href: site.phoneHref },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: FaFacebook, label: "Facebook", value: "facebook.com/BMMCKP", href: site.facebook, external: true },
  { icon: MapPin, label: "Address", value: site.address },
];

export default function Contact() {
  const mapQuery = encodeURIComponent(`${site.address}, Bangladesh`);

  return (
    <>
      <PageHeader eyebrow="Get in Touch" title="Contact Us" description="Have a question about our programs or the merit test, or want to support a student? Reach out to us." />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
            {channels.map(({ icon: Icon, label, value, href, external }) => {
              const body = (
                <>
                  <div className="w-12 h-12 rounded-xl bg-primary text-secondary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm opacity-70 mb-1">{label}</div>
                  <div className="font-semibold break-words">{value}</div>
                </>
              );
              const cls = "bg-card border rounded-2xl p-6 block";
              return href ? (
                <a
                  key={label}
                  href={href}
                  className={`${cls} hover:shadow-md hover:border-secondary/50 transition-all`}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {body}
                </a>
              ) : (
                <div key={label} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl overflow-hidden border bg-muted min-h-[320px]">
            <iframe
              title={`Map of ${site.address}`}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="w-full h-full min-h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
  );
}
