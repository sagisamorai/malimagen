import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { AdvantagesSection } from "@/components/home/AdvantagesSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { SITE_CONFIG } from "@/lib/constants";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "ראש העין",
      addressCountry: "IL",
    },
    sameAs: [SITE_CONFIG.social.facebook, SITE_CONFIG.social.instagram],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesSection />
      <Suspense fallback={<div className="section-padding" />}>
        <FeaturedProperties />
      </Suspense>
      <Suspense fallback={<div className="section-padding bg-[#0a1628]" />}>
        <AboutSection />
      </Suspense>
      <AdvantagesSection />
      <Suspense fallback={<div className="section-padding" />}>
        <TestimonialsSection />
      </Suspense>
      <ContactSection />
    </>
  );
}
