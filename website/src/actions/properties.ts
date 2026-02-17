"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { propertySchema, type PropertyFormData } from "@/lib/schemas";

export async function createProperty(data: PropertyFormData) {
  const userId = await requireAuth();

  try {
    const validated = propertySchema.parse(data);

    const property = await db.property.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        price: validated.price,
        type: validated.type,
        status: validated.status,
        address: validated.address,
        city: validated.city || "ראש העין",
        neighborhood: validated.neighborhood || null,
        complex: validated.complex || null,
        rooms: validated.rooms,
        floor: validated.floor ?? null,
        totalFloors: validated.totalFloors ?? null,
        sizeBuilt: validated.sizeBuilt,
        sizeGarden: validated.sizeGarden || null,
        yearBuilt: validated.yearBuilt ?? null,
        parking: validated.parking,
        storage: validated.storage,
        safeRoom: validated.safeRoom,
        elevator: validated.elevator,
        airCondition: validated.airCondition,
        balcony: validated.balcony,
        renovated: validated.renovated,
        accessible: validated.accessible,
        featuredImage: validated.featuredImage || null,
        seoTitle: validated.seoTitle || null,
        seoDescription: validated.seoDescription || null,
        seoKeywords: validated.seoKeywords || null,
        featured: validated.featured,
        published: validated.published,
        areaId: validated.areaId || null,
        authorId: userId,
      },
    });

    revalidatePath("/properties");
    revalidatePath("/");
    revalidatePath("/admin/properties");

    return { success: true, data: property };
  } catch (error: unknown) {
    console.error("Create property error:", error);
    const message = error instanceof Error ? error.message : "שגיאה ביצירת הנכס";
    return { success: false, error: message };
  }
}

export async function updateProperty(id: string, data: PropertyFormData) {
  await requireAuth();

  try {
    const validated = propertySchema.parse(data);

    const property = await db.property.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        description: validated.description,
        price: validated.price,
        type: validated.type,
        status: validated.status,
        address: validated.address,
        city: validated.city || "ראש העין",
        neighborhood: validated.neighborhood || null,
        complex: validated.complex || null,
        rooms: validated.rooms,
        floor: validated.floor ?? null,
        totalFloors: validated.totalFloors ?? null,
        sizeBuilt: validated.sizeBuilt,
        sizeGarden: validated.sizeGarden || null,
        yearBuilt: validated.yearBuilt ?? null,
        parking: validated.parking,
        storage: validated.storage,
        safeRoom: validated.safeRoom,
        elevator: validated.elevator,
        airCondition: validated.airCondition,
        balcony: validated.balcony,
        renovated: validated.renovated,
        accessible: validated.accessible,
        featuredImage: validated.featuredImage || null,
        seoTitle: validated.seoTitle || null,
        seoDescription: validated.seoDescription || null,
        seoKeywords: validated.seoKeywords || null,
        featured: validated.featured,
        published: validated.published,
        areaId: validated.areaId || null,
      },
    });

    revalidatePath("/properties");
    revalidatePath(`/properties/${property.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/properties");

    return { success: true, data: property };
  } catch (error: unknown) {
    console.error("Update property error:", error);
    const message = error instanceof Error ? error.message : "שגיאה בעדכון הנכס";
    return { success: false, error: message };
  }
}

export async function deleteProperty(id: string) {
  await requireAuth();

  try {
    await db.property.delete({ where: { id } });

    revalidatePath("/properties");
    revalidatePath("/");
    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    console.error("Delete property error:", error);
    return { success: false, error: "שגיאה במחיקת הנכס" };
  }
}

export async function togglePropertyFeatured(id: string) {
  await requireAuth();

  try {
    const property = await db.property.findUnique({ where: { id } });
    if (!property) return { success: false, error: "נכס לא נמצא" };

    await db.property.update({
      where: { id },
      data: { featured: !property.featured },
    });

    revalidatePath("/properties");
    revalidatePath("/");
    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return { success: false, error: "שגיאה בעדכון" };
  }
}

export async function addPropertyImages(propertyId: string, imageUrls: string[]) {
  await requireAuth();

  try {
    const maxOrder = await db.propertyImage.findFirst({
      where: { propertyId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    let order = (maxOrder?.order ?? -1) + 1;

    await db.propertyImage.createMany({
      data: imageUrls.map((url) => ({
        propertyId,
        url,
        order: order++,
      })),
    });

    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Add images error:", error);
    return { success: false, error: "שגיאה בהוספת תמונות" };
  }
}

export async function deletePropertyImage(imageId: string) {
  await requireAuth();

  try {
    await db.propertyImage.delete({ where: { id: imageId } });
    revalidatePath("/admin/properties");
    return { success: true };
  } catch (error) {
    console.error("Delete image error:", error);
    return { success: false, error: "שגיאה במחיקת תמונה" };
  }
}
