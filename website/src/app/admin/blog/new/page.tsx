import { db } from "@/lib/db";
import { BlogPostForm } from "@/components/forms/BlogPostForm";

export default async function NewBlogPostPage() {
  const categories = await db.blogCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">פוסט חדש</h1>
      <BlogPostForm categories={categories} />
    </div>
  );
}
