"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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
