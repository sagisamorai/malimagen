"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { blogPostSchema, type BlogPostFormData } from "@/lib/schemas";

export async function createBlogPost(data: BlogPostFormData) {
  const userId = await requireAuth();

  try {
    const validated = blogPostSchema.parse(data);

    const post = await db.blogPost.create({
      data: {
        ...validated,
        authorId: userId,
        publishedAt: validated.published ? new Date() : null,
        categoryId: validated.categoryId || null,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, data: post };
  } catch (error) {
    console.error("Create blog post error:", error);
    return { success: false, error: "שגיאה ביצירת הפוסט" };
  }
}

export async function updateBlogPost(id: string, data: BlogPostFormData) {
  await requireAuth();

  try {
    const validated = blogPostSchema.parse(data);

    const existing = await db.blogPost.findUnique({ where: { id } });

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...validated,
        publishedAt:
          validated.published && !existing?.publishedAt
            ? new Date()
            : existing?.publishedAt,
        categoryId: validated.categoryId || null,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");

    return { success: true, data: post };
  } catch (error) {
    console.error("Update blog post error:", error);
    return { success: false, error: "שגיאה בעדכון הפוסט" };
  }
}

export async function deleteBlogPost(id: string) {
  await requireAuth();

  try {
    await db.blogPost.delete({ where: { id } });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Delete blog post error:", error);
    return { success: false, error: "שגיאה במחיקת הפוסט" };
  }
}
