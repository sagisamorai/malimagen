import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Ruler, Building2 } from "lucide-react";
import type { PropertyWithRelations } from "@/types";
import {
  formatPrice,
  getPropertyTypeLabel,
  getPropertyStatusLabel,
  getPropertyStatusColor,
} from "@/lib/utils";

interface PropertyCardProps {
  property: PropertyWithRelations;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const statusColor = getPropertyStatusColor(property.status);
  const isSold = property.status === "SOLD";
  const isRented = property.status === "RENTED";
  const isUnavailable = isSold || isRented;

  // Use featuredImage if it's a valid URL, otherwise fallback to first image
  const displayImage =
    property.featuredImage && property.featuredImage.startsWith("http")
      ? property.featuredImage
      : property.images?.[0]?.url && property.images[0].url.startsWith("http")
      ? property.images[0].url
      : property.featuredImage;

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-gold/10 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 bg-gradient-to-br from-primary-50 to-gray-100 overflow-hidden">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={property.title}
              fill
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${isUnavailable ? "brightness-75 saturate-[0.6]" : ""}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className={`w-16 h-16 ${isUnavailable ? "text-gray-300" : "text-gold/20"}`} />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* SOLD stamp image */}
          {isSold && (
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <div className="relative w-36 h-36 opacity-90 drop-shadow-lg">
                <Image
                  src="/images/soldnobackground.png"
                  alt="נמכר"
                  fill
                  className="object-contain"
                  sizes="144px"
                />
              </div>
            </div>
          )}

          {/* RENTED stamp (no custom image, use text) */}
          {isRented && (
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <div className="px-6 py-2 rounded-md border-3 border-gray-500 text-xl font-black tracking-widest transform -rotate-12 bg-white/80 text-gray-700">
                הושכר
              </div>
            </div>
          )}

          {/* Status Badge - for available properties */}
          {!isUnavailable && (
            <div className="absolute top-3 right-3 z-[3]">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${statusColor} shadow-sm`}>
                {getPropertyStatusLabel(property.status)}
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {property.featured && !isUnavailable && (
            <div className="absolute top-3 left-3 z-[3]">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gold text-primary shadow-gold">
                מומלץ
              </span>
            </div>
          )}

          {/* Price overlay */}
          <div className={`absolute bottom-3 right-3 z-[3] backdrop-blur-sm text-white px-4 py-2 rounded-lg ${
            isUnavailable ? "bg-gray-800/90" : "bg-primary/90"
          }`}>
            <div className="text-lg font-bold">{formatPrice(property.price)}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gold-500 font-semibold bg-gold/10 px-2 py-0.5 rounded">
              {getPropertyTypeLabel(property.type)}
            </span>
            {property.area && (
              <span className="text-xs text-gray-400">{property.area.name}</span>
            )}
            {isUnavailable && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded mr-auto ${
                isSold ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
              }`}>
                {isSold ? "נמכר" : "הושכר"}
              </span>
            )}
          </div>

          <h3 className={`text-lg font-bold mb-2 line-clamp-1 transition-colors ${
            isUnavailable ? "text-gray-500" : "text-primary group-hover:text-gold-500"
          }`}>
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>{property.address}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gold/10">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-gold-400" />
              <span>{property.rooms} חד׳</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-gold-400" />
              <span>{property.sizeBuilt} מ״ר</span>
            </div>
            {property.floor !== null && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span>קומה {property.floor}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
