import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin, BedDouble, Ruler, Building2, Calendar, Car, Package, Shield,
  Wind, Maximize, Wrench, Accessibility, Phone,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, getPropertyTypeLabel, getPropertyStatusLabel, getPropertyStatusColor } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";

interface Props {
  params: { slug: string };
}

async function getProperty(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  return db.property.findUnique({
    where: { slug: decodedSlug },
    include: { images: { orderBy: { order: "asc" } }, area: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getProperty(params.slug);
  if (!property) return {};

  const title = property.seoTitle || property.title;
  const description = property.seoDescription || property.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: property.featuredImage ? [{ url: property.featuredImage }] : [],
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const property = await getProperty(params.slug);
  if (!property) notFound();

  const amenities = [
    { key: "parking", label: "חנייה", icon: Car, value: property.parking },
    { key: "storage", label: "מחסן", icon: Package, value: property.storage },
    { key: "safeRoom", label: "ממ״ד", icon: Shield, value: property.safeRoom },
    { key: "elevator", label: "מעלית", icon: Building2, value: property.elevator },
    { key: "airCondition", label: "מיזוג", icon: Wind, value: property.airCondition },
    { key: "balcony", label: "מרפסת", icon: Maximize, value: property.balcony },
    { key: "renovated", label: "משופצת", icon: Wrench, value: property.renovated },
    { key: "accessible", label: "נגישה", icon: Accessibility, value: property.accessible },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${SITE_CONFIG.url}/properties/${property.slug}`,
    image: property.featuredImage,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "ILS",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressCountry: "IL",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="section-padding">
        <div className="container mx-auto">
          {/* Sold/Rented Banner */}
          {(property.status === "SOLD" || property.status === "RENTED") && (
            <div className={`mb-6 rounded-xl p-4 flex items-center gap-3 ${
              property.status === "SOLD"
                ? "bg-red-50 border-2 border-red-200"
                : "bg-gray-50 border-2 border-gray-200"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                property.status === "SOLD" ? "bg-red-600" : "bg-gray-600"
              }`}>
                {property.status === "SOLD" ? "!" : "✓"}
              </div>
              <div>
                <p className={`text-lg font-bold ${property.status === "SOLD" ? "text-red-700" : "text-gray-700"}`}>
                  נכס זה {property.status === "SOLD" ? "נמכר" : "הושכר"}
                </p>
                <p className="text-sm text-gray-500">הנכס אינו זמין יותר. צרו קשר לנכסים דומים.</p>
              </div>
            </div>
          )}

          {/* Gallery */}
          <div className="relative">
            <PropertyGallery images={property.images} title={property.title} />
            {/* Sold overlay stamp on gallery */}
            {property.status === "SOLD" && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="relative w-52 h-52 md:w-64 md:h-64 opacity-90 drop-shadow-xl">
                  <Image
                    src="/images/soldnobackground.png"
                    alt="נמכר"
                    fill
                    className="object-contain"
                    sizes="256px"
                  />
                </div>
              </div>
            )}
            {property.status === "RENTED" && (
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/15 rounded-2xl" />
                <div className="relative px-10 py-4 rounded-lg border-4 border-gray-400 text-3xl md:text-4xl font-black tracking-widest transform -rotate-12 bg-white/80 text-gray-700">
                  הושכר
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPropertyStatusColor(property.status)}`}>
                    {getPropertyStatusLabel(property.status)}
                  </span>
                  <span className="text-sm text-accent font-medium">
                    {getPropertyTypeLabel(property.type)}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-5 h-5" />
                  <span>{property.address}, {property.city}</span>
                </div>
                <div className="text-3xl font-bold text-primary mt-4">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Quick Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-background-secondary rounded-xl p-4 text-center">
                  <BedDouble className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-gray-500">חדרים</div>
                  <div className="font-bold text-primary">{property.rooms}</div>
                </div>
                <div className="bg-background-secondary rounded-xl p-4 text-center">
                  <Ruler className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm text-gray-500">שטח בנוי</div>
                  <div className="font-bold text-primary">{property.sizeBuilt} מ״ר</div>
                </div>
                {property.floor !== null && (
                  <div className="bg-background-secondary rounded-xl p-4 text-center">
                    <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-sm text-gray-500">קומה</div>
                    <div className="font-bold text-primary">
                      {property.floor}{property.totalFloors ? ` / ${property.totalFloors}` : ""}
                    </div>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="bg-background-secondary rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-sm text-gray-500">שנת בנייה</div>
                    <div className="font-bold text-primary">{property.yearBuilt}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-4">תיאור הנכס</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-4">מאפיינים</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity.key}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        amenity.value
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      <amenity.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-background-secondary rounded-2xl p-6 border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold text-primary mb-4">
                  מעוניינים בנכס?
                </h3>
                <ContactForm propertyId={property.id} source={`property-${property.slug}`} />

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a href={`tel:${SITE_CONFIG.phone}`}>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4" />
                      {SITE_CONFIG.phone}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
