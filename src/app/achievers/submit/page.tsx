import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SubmitForm from "./SubmitForm";

export const metadata: Metadata = {
  title: "Add Your Name | BMMSWC",
  description: "Got a place at a university, medical college or engineering college? Send your details to join our Achievers list.",
};

export default function SubmitAchiever() {
  return (
    <>
      <PageHeader
        eyebrow="Our Achievers"
        title="Add your name"
        description="Got a place at a university, medical college or engineering college? Fill in this form. We will check your details and add you to the Achievers list."
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <SubmitForm />
      </div>
    </>
  );
}
