"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { blogPostSchema, type BlogPostFormData } from "@/lib/schemas";
import { createBlogPost, updateBlogPost } from "@/actions/blog";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { BlogPost, BlogCategory } from "@/types";

interface BlogPostFormProps {
  post?: BlogPost | null;
  categories: BlogCategory[];
}

export function BlogPostForm({ post, categories }: BlogPostFormProps) {
  const router = useRouter();
  const isEdit = !!post;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: post
      ? {
          ...post,
          categoryId: post.categoryId || undefined,
          excerpt: post.excerpt || undefined,
          featuredImage: post.featuredImage || undefined,
          seoTitle: post.seoTitle || undefined,
          seoDescription: post.seoDescription || undefined,
          seoKeywords: post.seoKeywords || undefined,
        }
      : { published: true },
  });

  const title = watch("title");

  const onSubmit = async (data: BlogPostFormData) => {
    const result = isEdit
      ? await updateBlogPost(post!.id, data)
      : await createBlogPost(data);

    if (result.success) {
      toast.success(isEdit ? "הפוסט עודכן" : "הפוסט נוצר");
      router.push("/admin/blog");
    } else {
      toast.error(result.error);
    }
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-4">פרטי הפוסט</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="כותרת" error={errors.title?.message} {...register("title")} />
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input label="Slug" dir="ltr" error={errors.slug?.message} {...register("slug")} />
              </div>
              <Button type="button" variant="secondary" onClick={() => title && setValue("slug", slugify(title))} className="h-11">
                צור
              </Button>
            </div>
          </div>
          <Select label="קטגוריה" options={categoryOptions} placeholder="בחר קטגוריה" {...register("categoryId")} />
          <Textarea label="תקציר" rows={3} error={errors.excerpt?.message} {...register("excerpt")} />
          <Textarea label="תוכן" rows={15} error={errors.content?.message} {...register("content")} />
          <Input label="תמונה ראשית (URL)" dir="ltr" {...register("featuredImage")} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-primary mb-4">SEO</h3>
        <div className="space-y-4">
          <Input label="כותרת SEO" {...register("seoTitle")} />
          <Textarea label="תיאור SEO" rows={3} {...register("seoDescription")} />
          <Input label="מילות מפתח" {...register("seoKeywords")} />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary rounded" {...register("published")} />
            <span className="text-sm font-medium">פורסם</span>
          </label>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>ביטול</Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "עדכן פוסט" : "צור פוסט"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
