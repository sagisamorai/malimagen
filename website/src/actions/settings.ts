"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import type { PropertyType } from "@prisma/client";

// ============================================
// Hero Category Settings
// ============================================

const HERO_CATEGORIES: { type: PropertyType; label: string }[] = [
  { type: "APARTMENT", label: "דירות" },
  { type: "COTTAGE", label: "קוטג׳ים" },
  { type: "PENTHOUSE", label: "פנטהאוזים" },
  { type: "GARDEN_APT", label: "דירות גן" },
];

export type HeroCategoryData = {
  type: PropertyType;
  label: string;
  image: string | null;
  manualImage: string | null;
  autoImage: string | null;
  propertyCount: number;
  sourceProperty?: { title: string; slug: string } | null;
};

export async function getHeroCategoryData(): Promise<HeroCategoryData[]> {
  try {
    // Fetch manual overrides from site_settings
    const settingKeys = HERO_CATEGORIES.map((c) => `hero_image_${c.type}`);
    const settings = await db.siteSetting.findMany({
      where: { key: { in: settingKeys } },
    });
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      if (s.value) settingsMap[s.key] = s.value;
    }

    // For each category, get auto image + count
    const results: HeroCategoryData[] = await Promise.all(
      HERO_CATEGORIES.map(async (cat) => {
        const manualImage = settingsMap[`hero_image_${cat.type}`] || null;

        // Find first published property with a featured image for this type
        const autoProperty = await db.property.findFirst({
          where: {
            type: cat.type,
            published: true,
            featuredImage: { not: null },
          },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          select: { title: true, slug: true, featuredImage: true },
        });

        // Count available properties of this type
        const propertyCount = await db.property.count({
          where: {
            type: cat.type,
            published: true,
            status: { in: ["FOR_SALE", "FOR_RENT"] },
          },
        });

        const autoImage = autoProperty?.featuredImage || null;

        return {
          type: cat.type,
          label: cat.label,
          image: manualImage || autoImage,
          manualImage,
          autoImage,
          propertyCount,
          sourceProperty: autoProperty
            ? { title: autoProperty.title, slug: autoProperty.slug }
            : null,
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Error fetching hero category data:", error);
    return HERO_CATEGORIES.map((cat) => ({
      type: cat.type,
      label: cat.label,
      image: null,
      manualImage: null,
      autoImage: null,
      propertyCount: 0,
      sourceProperty: null,
    }));
  }
}

export async function updateHeroCategorySettings(
  data: Record<string, string | null>
) {
  await requireAuth();

  try {
    const operations = Object.entries(data).map(([type, imageUrl]) => {
      const key = `hero_image_${type}`;
      return db.siteSetting.upsert({
        where: { key },
        update: { value: imageUrl || "" },
        create: { key, value: imageUrl || "" },
      });
    });

    await db.$transaction(operations);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update hero settings error:", error);
    return { success: false, error: "שגיאה בשמירת הגדרות ה-Hero" };
  }
}

// ============================================
// About Settings
// ============================================

export async function updateAboutSettings(data: {
  title: string;
  text: string;
  image: string | null;
  background: string | null;
}) {
  await requireAuth();

  try {
    const operations = [
      db.siteSetting.upsert({
        where: { key: "about_title" },
        update: { value: data.title },
        create: { key: "about_title", value: data.title },
      }),
      db.siteSetting.upsert({
        where: { key: "about_text" },
        update: { value: data.text },
        create: { key: "about_text", value: data.text },
      }),
      db.siteSetting.upsert({
        where: { key: "about_bg" },
        update: { value: data.background || "" },
        create: { key: "about_bg", value: data.background || "" },
      }),
    ];

    if (data.image !== null) {
      operations.push(
        db.siteSetting.upsert({
          where: { key: "about_image" },
          update: { value: data.image },
          create: { key: "about_image", value: data.image },
        })
      );
    }

    await db.$transaction(operations);

    revalidatePath("/");
    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("Update about settings error:", error);
    return { success: false, error: "שגיאה בשמירת ההגדרות" };
  }
}

export async function getAboutSettings() {
  try {
    const settings = await db.siteSetting.findMany({
      where: {
        key: { in: ["about_title", "about_text", "about_image", "about_bg"] },
      },
    });

    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    return {
      title: map["about_title"] || "קצת עליי",
      text: map["about_text"] || "",
      image: map["about_image"] || null,
      background: map["about_bg"] || null,
    };
  } catch {
    return { title: "קצת עליי", text: "", image: null, background: null };
  }
}
