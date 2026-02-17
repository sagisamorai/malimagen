"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Filter, X } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/constants";

interface PropertyFiltersProps {
  areas: { value: string; label: string }[];
}

export function PropertyFilters({ areas }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/properties");
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-white rounded-2xl border border-gold/10 shadow-premium p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gold-500" />
        <span className="text-sm font-semibold text-primary">סינון נכסים</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <Input
            placeholder="חיפוש לפי כתובת, כותרת..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => updateFilters("search", e.target.value)}
            className="border-gold/15 focus:ring-gold/20 focus:border-gold"
          />
        </div>

        <Select
          options={[{ value: "", label: "כל הסוגים" }, ...PROPERTY_TYPES]}
          defaultValue={searchParams.get("type") || ""}
          onChange={(e) => updateFilters("type", e.target.value)}
          className="border-gold/15"
        />

        <Select
          options={[{ value: "", label: "כל הסטטוסים" }, ...PROPERTY_STATUSES]}
          defaultValue={searchParams.get("status") || ""}
          onChange={(e) => updateFilters("status", e.target.value)}
          className="border-gold/15"
        />

        <Select
          options={[{ value: "", label: "כל האזורים" }, ...areas]}
          defaultValue={searchParams.get("areaId") || ""}
          onChange={(e) => updateFilters("areaId", e.target.value)}
          className="border-gold/15"
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
        <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
          <Input
            type="number"
            placeholder="מחיר מינימום"
            defaultValue={searchParams.get("minPrice") || ""}
            onChange={(e) => updateFilters("minPrice", e.target.value)}
            className="border-gold/15"
          />
          <Input
            type="number"
            placeholder="מחיר מקסימום"
            defaultValue={searchParams.get("maxPrice") || ""}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
            className="border-gold/15"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <X className="w-4 h-4" />
            נקה סינון
          </Button>
        )}
      </div>
    </div>
  );
}
