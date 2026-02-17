import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteBlogButton } from "./actions-buttons";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">בלוג</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="w-4 h-4" />
            פוסט חדש
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right p-4 text-sm font-medium text-gray-500">כותרת</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">קטגוריה</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">סטטוס</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">תאריך</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  אין פוסטים עדיין
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{post.title}</td>
                  <td className="p-4 text-sm text-gray-500">{post.category?.name || "—"}</td>
                  <td className="p-4">
                    <Badge variant={post.published ? "success" : "default"}>
                      {post.published ? "פורסם" : "טיוטה"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" title="צפה בפוסט">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" title="ערוך">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <DeleteBlogButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
