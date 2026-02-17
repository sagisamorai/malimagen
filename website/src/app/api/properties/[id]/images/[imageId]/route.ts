import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { del } from "@vercel/blob";

// DELETE - remove an image
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const image = await db.propertyImage.findUnique({
      where: { id: params.imageId },
    });

    if (!image) {
      return NextResponse.json(
        { error: "תמונה לא נמצאה" },
        { status: 404 }
      );
    }

    // Delete from database
    await db.propertyImage.delete({
      where: { id: params.imageId },
    });

    // If this was the featured image, clear it or set to next available
    const property = await db.property.findUnique({
      where: { id: params.id },
      select: { featuredImage: true },
    });

    if (property?.featuredImage === image.url) {
      const nextImage = await db.propertyImage.findFirst({
        where: { propertyId: params.id },
        orderBy: { order: "asc" },
      });

      await db.property.update({
        where: { id: params.id },
        data: { featuredImage: nextImage?.url || null },
      });
    }

    // Try to delete from Vercel Blob
    try {
      if (image.url.includes("blob.vercel-storage.com")) {
        await del(image.url);
      }
    } catch {
      // Blob deletion failed, not critical
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "שגיאה במחיקת התמונה" },
      { status: 500 }
    );
  }
}
