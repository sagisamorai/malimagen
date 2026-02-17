import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT - set the featured image for a property
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();

    await db.property.update({
      where: { id: params.id },
      data: { featuredImage: url },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set featured image error:", error);
    return NextResponse.json(
      { error: "שגיאה בעדכון התמונה הראשית" },
      { status: 500 }
    );
  }
}
