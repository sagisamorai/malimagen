"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { contactSchema, type ContactFormData } from "@/lib/schemas";

export async function submitContact(data: ContactFormData) {
  try {
    const validated = contactSchema.parse(data);

    await db.contact.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        message: validated.message || null,
        propertyId: validated.propertyId || null,
        source: validated.source || null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");

    return { success: true };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { success: false, error: "שגיאה בשליחת הטופס. נסו שוב." };
  }
}

export async function markContactAsRead(id: string) {
  await requireAuth();

  try {
    await db.contact.update({
      where: { id },
      data: { read: true },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Mark contact read error:", error);
    return { success: false, error: "שגיאה בעדכון" };
  }
}

export async function markContactAsUnread(id: string) {
  await requireAuth();

  try {
    await db.contact.update({
      where: { id },
      data: { read: false },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Mark contact unread error:", error);
    return { success: false, error: "שגיאה בעדכון" };
  }
}

export async function deleteContact(id: string) {
  await requireAuth();

  try {
    await db.contact.delete({ where: { id } });

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Delete contact error:", error);
    return { success: false, error: "שגיאה במחיקת הפנייה" };
  }
}

export async function markAllContactsAsRead() {
  await requireAuth();

  try {
    await db.contact.updateMany({
      where: { read: false },
      data: { read: true },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Mark all read error:", error);
    return { success: false, error: "שגיאה בעדכון" };
  }
}
