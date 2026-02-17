import type { Metadata } from "next";
import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { db } from "@/lib/db";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { PropertyFilterParams } from "@/types";

export const metadata: Metadata = {
  title: "נכסים",
  description: "דירות ונכסים למכירה ולהשכרה בפסגות אפק, ראש העין. מגוון רחב של נכסים במחירים אטרקטיביים.",
};

interface Props {
  searchParams: PropertyFilterParams;
}

async function getProperties(params: PropertyFilterParams) {
  const page = parseInt(params.page || "1");
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: Record<string, unknown> = { published: true };

  if (params.type) where.type = params.type;
  if (params.status) where.status = params.status;
  if (params.areaId) where.areaId = params.areaId;

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) (where.price as Record<string, number>).gte = parseInt(params.minPrice);
    if (params.maxPrice) (where.price as Record<string, number>).lte = parseInt(params.maxPrice);
  }

  if (params.minRooms || params.maxRooms) {
    where.rooms = {};
    if (params.minRooms) (where.rooms as Record<string, number>).gte = parseFloat(params.minRooms);
    if (params.maxRooms) (where.rooms as Record<string, number>).lte = parseFloat(params.maxRooms);
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { address: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [properties, total] = await Promise.all([
    db.property.findMany({
      where: where as never,
      include: { images: true, area: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.property.count({ where: where as never }),
  ]);

  return { properties, total, totalPages: Math.ceil(total / ITEMS_PER_PAGE), page };
}

export default async function PropertiesPage({ searchParams }: Props) {
  let areaOptions: { value: string; label: string }[] = [];
  let properties: Awaited<ReturnType<typeof getProperties>>["properties"] = [];
  let total = 0;
  let totalPages = 0;
  let page = 1;

  try {
    const areas = await db.area.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    areaOptions = areas.map((a) => ({ value: a.id, label: a.name }));
    const result = await getProperties(searchParams);
    properties = result.properties;
    total = result.total;
    totalPages = result.totalPages;
    page = result.page;
  } catch {
    // DB not available
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative py-16 md:py-20 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px]" />

        <div className="container mx-auto relative z-10 text-center">
          <div className="gold-line-center mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">נכסים</h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto">
            מצאו את הנכס המושלם עבורכם בפסגות אפק וראש העין
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L720 20L1440 40V40H0Z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      <div className="section-padding bg-background-secondary">
        <div className="container mx-auto">
          <Suspense fallback={<div className="h-32 animate-pulse bg-white rounded-2xl" />}>
            <PropertyFilters areas={areaOptions} />
          </Suspense>

          <div className="mb-6 text-sm text-gray-500">
            {total > 0 ? `נמצאו ${total} נכסים` : ""}
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gold/10 shadow-premium">
              <Building2 className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <p className="text-xl font-semibold text-primary mb-2">אין נכסים עדיין</p>
              <p className="text-gray-400">נכסים חדשים יתווספו בקרוב</p>
            </div>
          ) : (
            <PropertyGrid properties={properties} />
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }).map((_, i) => (
                <a
                  key={i}
                  href={`/properties?page=${i + 1}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    page === i + 1
                      ? "bg-primary text-white shadow-premium"
                      : "bg-white text-gray-600 border border-gold/10 hover:border-gold/30"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
