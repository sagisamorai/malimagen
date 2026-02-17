import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BlogPostForm } from "@/components/forms/BlogPostForm";

interface Props {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: Props) {
  const [post, categories] = await Promise.all([
    db.blogPost.findUnique({ where: { id: params.id } }),
    db.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">
        עריכת פוסט: {post.title}
      </h1>
      <BlogPostForm post={post} categories={categories} />
    </div>
  );
}
