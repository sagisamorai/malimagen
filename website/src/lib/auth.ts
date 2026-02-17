"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Ensure user exists in DB (auto-sync from Clerk)
  const existingUser = await db.user.findUnique({ where: { id: userId } });

  if (!existingUser) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Unauthorized");

    await db.user.create({
      data: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        role: "ADMIN", // First user gets admin
      },
    });
  }

  return userId;
}
