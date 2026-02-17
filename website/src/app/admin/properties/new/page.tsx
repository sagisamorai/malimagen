import { db } from "@/lib/db";
import { PropertyForm } from "@/components/forms/PropertyForm";

export default async function NewPropertyPage() {
  const areas = await db.area.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">נכס חדש</h1>
      <PropertyForm areas={areas} />
    </div>
  );
}
