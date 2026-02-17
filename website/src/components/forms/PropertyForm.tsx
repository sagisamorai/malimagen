"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { propertySchema, type PropertyFormData } from "@/lib/schemas";
import { createProperty, updateProperty } from "@/actions/properties";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PROPERTY_TYPES, PROPERTY_STATUSES } from "@/lib/constants";
import type { Area, PropertyImage } from "@prisma/client";
import type { Property } from "@prisma/client";
import { useState, useCallback } from "react";
import { ImageIcon } from "lucide-react";

interface PropertyFormProps {
  property?: (Property & { images: PropertyImage[] }) | null;
  areas: Area[];
}

export function PropertyForm({ property, areas }: PropertyFormProps) {
  const router = useRouter();
  const isEdit = !!property;

  const [images, setImages] = useState<PropertyImage[]>(property?.images || []);
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState<string | null>(
    property?.featuredImage || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          ...property,
          neighborhood: property.neighborhood ?? undefined,
          complex: property.complex ?? undefined,
          areaId: property.areaId || undefined,
          floor: property.floor ?? undefined,
          totalFloors: property.totalFloors ?? undefined,
          sizeGarden: property.sizeGarden ?? undefined,
          yearBuilt: property.yearBuilt ?? undefined,
          featuredImage: property.featuredImage ?? undefined,
          seoTitle: property.seoTitle ?? undefined,
          seoDescription: property.seoDescription ?? undefined,
          seoKeywords: property.seoKeywords ?? undefined,
        }
      : {
          city: "ראש העין",
          type: "APARTMENT",
          status: "FOR_SALE",
          published: true,
        },
  });

  const title = watch("title");

  const refreshImages = useCallback(async () => {
    if (!property?.id) return;
    try {
      const res = await fetch(`/api/properties/${property.id}/images`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
      // Also refresh the property to get updated featuredImage
      const propRes = await fetch(`/api/properties/${property.id}`);
      if (propRes.ok) {
        const propData = await propRes.json();
        setCurrentFeaturedImage(propData.featuredImage || null);
      }
    } catch (error) {
      console.error("Error refreshing images:", error);
    }
  }, [property?.id]);

  const onSubmit = async (data: PropertyFormData) => {
    const result = isEdit
      ? await updateProperty(property!.id, data)
      : await createProperty(data);

    if (result.success) {
      if (isEdit) {
        toast.success("הנכס עודכן בהצלחה");
        router.push("/admin/properties");
      } else {
        toast.success("הנכס נוצר בהצלחה! עכשיו תוכל להוסיף תמונות");
        // Redirect to edit page so user can upload images
        router.push(`/admin/properties/${result.data?.id}/edit`);
      }
    } else {
      toast.error(result.error);
    }
  };

  const generateSlug = () => {
    if (title) {
      setValue("slug", slugify(title));
    }
  };

  const areaOptions = areas.map((a) => ({ value: a.id, label: a.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Image Upload Section - Only show on edit */}
      {isEdit && property && (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">תמונות הנכס</h3>
              <p className="text-xs text-gray-400">העלה תמונות וגרור לשינוי סדר. לחץ על הכוכב להגדיר תמונה ראשית.</p>
            </div>
          </div>
          <ImageUpload
            propertyId={property.id}
            existingImages={images}
            featuredImage={currentFeaturedImage}
            onImagesChange={refreshImages}
          />
        </div>
      )}

      {/* Show info message for new properties */}
      {!isEdit && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-sm text-blue-700">
              לאחר יצירת הנכס, תועבר לדף עריכה בו תוכל להעלות תמונות.
            </p>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-4">פרטי הנכס</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="כותרת" error={errors.title?.message} {...register("title")} />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input label="Slug" dir="ltr" error={errors.slug?.message} {...register("slug")} />
            </div>
            <Button type="button" variant="secondary" onClick={generateSlug} className="h-11">
              צור
            </Button>
          </div>
          <Textarea label="תיאור" className="md:col-span-2" error={errors.description?.message} {...register("description")} />
          <Input label="מחיר (₪)" type="number" error={errors.price?.message} {...register("price")} />
          <Select label="סוג נכס" options={PROPERTY_TYPES.map(t => ({ ...t }))} error={errors.type?.message} {...register("type")} />
          <Select label="סטטוס" options={PROPERTY_STATUSES.map(s => ({ ...s }))} error={errors.status?.message} {...register("status")} />
          <Select label="אזור" options={areaOptions} placeholder="בחר אזור" {...register("areaId")} />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-4">מיקום</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="כתובת" error={errors.address?.message} {...register("address")} />
          <Input label="עיר" {...register("city")} />
          <Input label="שכונה" {...register("neighborhood")} />
          <Input label="מתחם" placeholder="A / B" {...register("complex")} />
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-4">פרטים טכניים</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="חדרים" type="number" step="0.5" error={errors.rooms?.message} {...register("rooms")} />
          <Input label="שטח בנוי (מ״ר)" type="number" error={errors.sizeBuilt?.message} {...register("sizeBuilt")} />
          <Input label="שטח גינה (מ״ר)" type="number" {...register("sizeGarden")} />
          <Input label="קומה" type="number" {...register("floor")} />
          <Input label="סה״כ קומות" type="number" {...register("totalFloors")} />
          <Input label="שנת בנייה" type="number" {...register("yearBuilt")} />
        </div>

        {/* Amenities Checkboxes */}
        <h4 className="text-md font-semibold text-gray-700 mt-6 mb-3">מאפיינים</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: "parking", label: "חנייה" },
            { key: "storage", label: "מחסן" },
            { key: "safeRoom", label: "ממ״ד" },
            { key: "elevator", label: "מעלית" },
            { key: "airCondition", label: "מיזוג" },
            { key: "balcony", label: "מרפסת" },
            { key: "renovated", label: "משופצת" },
            { key: "accessible", label: "נגישה" },
          ].map((amenity) => (
            <label key={amenity.key} className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary rounded"
                {...register(amenity.key as keyof PropertyFormData)}
              />
              <span className="text-sm">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-4">SEO</h3>
        <div className="space-y-4">
          <Input label="כותרת SEO" placeholder="ישתמש בכותרת הנכס אם ריק" {...register("seoTitle")} />
          <Textarea label="תיאור SEO" placeholder="ישתמש בתיאור הנכס אם ריק" {...register("seoDescription")} />
          <Input label="מילות מפתח" placeholder="מופרדות בפסיקים" {...register("seoKeywords")} />
        </div>
      </div>

      {/* Publish */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary rounded" {...register("published")} />
              <span className="text-sm font-medium">פורסם</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-primary rounded" {...register("featured")} />
              <span className="text-sm font-medium">מומלץ</span>
            </label>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              ביטול
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "עדכן נכס" : "צור נכס"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
