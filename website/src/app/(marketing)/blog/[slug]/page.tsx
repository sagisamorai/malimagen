import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  return db.blogPost.findFirst({
    where: { slug: decodedSlug, published: true },
    include: { category: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || "",
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    image: post.featuredImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: SITE_CONFIG.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="section-padding">
        <div className="container mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent hover:text-primary mb-8 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לבלוג
          </Link>

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="text-sm text-accent font-medium mb-3 block">
                {post.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {post.title}
            </h1>
            {post.publishedAt && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>
      </article>
    </>
  );
}
