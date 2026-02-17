import { PropertyCard } from "./PropertyCard";
import type { PropertyWithRelations } from "@/types";

interface PropertyGridProps {
  properties: PropertyWithRelations[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500 mb-2">לא נמצאו נכסים</p>
        <p className="text-gray-400">נסו לשנות את הסינון או לחפש משהו אחר</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
