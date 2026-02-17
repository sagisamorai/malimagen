import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

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
    // Get the image record
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

    // Try to delete the file from disk
    try {
      if (image.url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", image.url);
        await unlink(filePath);
      }
    } catch {
      // File might not exist, that's ok
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
