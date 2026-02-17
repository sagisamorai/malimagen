import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - fetch a single property
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await db.property.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: "asc" } },
        area: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "נכס לא נמצא" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Fetch property error:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת הנכס" },
      { status: 500 }
    );
  }
}
