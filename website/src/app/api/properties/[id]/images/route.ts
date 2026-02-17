import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - fetch images for a property
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const images = await db.propertyImage.findMany({
      where: { propertyId: params.id },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Fetch images error:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת התמונות" },
      { status: 500 }
    );
  }
}

// POST - add images to a property
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "No image URLs provided" },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "נכס לא נמצא" },
        { status: 404 }
      );
    }

    // Get current max order
    const maxOrder = await db.propertyImage.findFirst({
      where: { propertyId: params.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    let order = (maxOrder?.order ?? -1) + 1;

    // Create image records
    await db.propertyImage.createMany({
      data: urls.map((url: string) => ({
        propertyId: params.id,
        url,
        order: order++,
      })),
    });

    const images = await db.propertyImage.findMany({
      where: { propertyId: params.id },
      orderBy: { order: "asc" },
    });

    // If no featured image is set, use the first uploaded image
    if (!property.featuredImage) {
      await db.property.update({
        where: { id: params.id },
        data: { featuredImage: urls[0] },
      });
    }

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Add images error:", error);
    return NextResponse.json(
      { error: "שגיאה בהוספת התמונות" },
      { status: 500 }
    );
  }
}
