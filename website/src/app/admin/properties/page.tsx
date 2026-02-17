import Link from "next/link";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, getPropertyTypeLabel, getPropertyStatusLabel } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeletePropertyButton, ToggleFeaturedButton } from "./actions-buttons";

export default async function AdminPropertiesPage() {
  const properties = await db.property.findMany({
    include: { area: true, _count: { select: { images: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">נכסים</h1>
        <Link href="/admin/properties/new">
          <Button>
            <Plus className="w-4 h-4" />
            נכס חדש
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right p-4 text-sm font-medium text-gray-500">נכס</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">סוג</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">סטטוס</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">מחיר</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">תמונות</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  אין נכסים עדיין. הוסיפו את הנכס הראשון!
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{property.title}</div>
                    <div className="text-sm text-gray-500">{property.address}</div>
                  </td>
                  <td className="p-4 text-sm">{getPropertyTypeLabel(property.type)}</td>
                  <td className="p-4">
                    <Badge variant={property.status === "FOR_SALE" ? "success" : property.status === "SOLD" ? "danger" : "info"}>
                      {getPropertyStatusLabel(property.status)}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(property.price)}</td>
                  <td className="p-4 text-sm text-gray-500">{property._count.images}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ToggleFeaturedButton id={property.id} featured={property.featured} />
                      <Link href={`/admin/properties/${property.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeletePropertyButton id={property.id} title={property.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
