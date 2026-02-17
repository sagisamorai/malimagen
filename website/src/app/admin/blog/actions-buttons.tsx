"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { deleteBlogPost } from "@/actions/blog";

export function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const handleDelete = async () => {
    if (!confirm(`למחוק את "${title}"?`)) return;

    const result = await deleteBlogPost(id);
    if (result.success) {
      toast.success("הפוסט נמחק");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="w-4 h-4 text-red-500" />
    </Button>
  );
}
