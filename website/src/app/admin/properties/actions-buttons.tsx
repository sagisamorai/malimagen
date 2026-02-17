"use client";

import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { deleteProperty, togglePropertyFeatured } from "@/actions/properties";

export function ToggleFeaturedButton({ id, featured }: { id: string; featured: boolean }) {
  const handleToggle = async () => {
    const result = await togglePropertyFeatured(id);
    if (result.success) {
      toast.success(featured ? "הנכס הוסר ממומלצים" : "הנכס סומן כמומלץ");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle} title={featured ? "הסר ממומלצים" : "סמן כמומלץ"}>
      <Star className={`w-4 h-4 ${featured ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
    </Button>
  );
}

export function DeletePropertyButton({ id, title }: { id: string; title: string }) {
  const handleDelete = async () => {
    if (!confirm(`למחוק את "${title}"?`)) return;

    const result = await deleteProperty(id);
    if (result.success) {
      toast.success("הנכס נמחק בהצלחה");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="w-4 h-4 text-red-500" />
    </Button>
  );
}
