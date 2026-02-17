import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PropertyForm } from "@/components/forms/PropertyForm";

interface Props {
  params: { id: string };
}

export default async function EditPropertyPage({ params }: Props) {
  const [property, areas] = await Promise.all([
    db.property.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    db.area.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!property) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">
        עריכת נכס: {property.title}
      </h1>
      <PropertyForm property={property} areas={areas} />
    </div>
  );
}
