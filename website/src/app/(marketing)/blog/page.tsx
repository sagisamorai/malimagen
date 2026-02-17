import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowLeft, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "בלוג",
  description: "מאמרים, טיפים ועדכונים מעולם הנדל״ן מאת מלי מגן.",
};

export default async function BlogPage() {
  const fetchPosts = () =>
    db.blogPost.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    });

  let posts: Awaited<ReturnType<typeof fetchPosts>> = [];
  try {
    posts = await fetchPosts();
  } catch {
    // DB not available
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative py-16 md:py-20 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
        <div className="container mx-auto relative z-10 text-center">
          <div className="gold-line-center mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">בלוג</h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto">
            מאמרים, טיפים ועדכונים מעולם הנדל״ן
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L720 20L1440 40V40H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <div className="section-padding bg-white">
        <div className="container mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-background-warm rounded-3xl border border-gold/10 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gold/30 mx-auto mb-4" />
              <p className="text-xl font-semibold text-primary mb-2">אין פוסטים עדיין</p>
              <p className="text-gray-400">תוכן חדש יתפרסם בקרוב</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <article className="card-premium rounded-2xl overflow-hidden">
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <span className="text-xs text-gold-500 font-semibold mb-2 block">
                          {post.category.name}
                        </span>
                      )}
                      <h2 className="text-lg font-bold text-primary mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-gold/10">
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.publishedAt)}
                          </div>
                        )}
                        <span className="flex items-center gap-1 text-gold-500 font-medium group-hover:text-gold-600">
                          קרא עוד
                          <ArrowLeft className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
