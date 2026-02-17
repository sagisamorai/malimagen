import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "צור קשר",
  description: "צרו קשר עם מלי מגן לייעוץ מקצועי בנושאי נדל״ן. תיווך, מכירה וקנייה בפסגות אפק, ראש העין.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative py-16 md:py-20 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
        <div className="container mx-auto relative z-10 text-center">
          <div className="gold-line-center mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">צור קשר</h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto">
            נשמח לעמוד לשירותכם
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L720 20L1440 40V40H0Z" fill="#FDF8F0"/>
          </svg>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
