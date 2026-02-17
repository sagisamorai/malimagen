import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/properties/PropertyCard";

export async function FeaturedProperties() {
  let properties: Awaited<ReturnType<typeof db.property.findMany>> = [];
  try {
    properties = await db.property.findMany({
      where: { published: true, featured: true },
      include: { images: true, area: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    return null;
  }

  if (properties.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title">נכסים מומלצים</h2>
            <p className="text-gray-600">הנכסים הנבחרים שלנו</p>
          </div>
          <Link href="/properties">
            <Button variant="ghost">
              כל הנכסים
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
