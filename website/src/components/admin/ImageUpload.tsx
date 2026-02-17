"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X, GripVertical, Star, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { PropertyImage } from "@prisma/client";

interface ImageUploadProps {
  propertyId: string;
  existingImages: PropertyImage[];
  featuredImage: string | null;
  onImagesChange: () => void;
}

export function ImageUpload({
  propertyId,
  existingImages,
  featuredImage,
  onImagesChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!files.length) return;

      const fileArray = Array.from(files);

      // Validate before upload
      for (const file of fileArray) {
        if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
          toast.error(`סוג קובץ לא נתמך: ${file.name}`);
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`הקובץ ${file.name} גדול מ-10MB`);
          return;
        }
      }

      setUploading(true);

      try {
        // Step 1: Upload files to server
        const formData = new FormData();
        fileArray.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "שגיאה בהעלאה");
        }

        const { files: uploadedFiles } = await uploadRes.json();
        const urls = uploadedFiles.map((f: { url: string }) => f.url);

        // Step 2: Save image records to DB
        const saveRes = await fetch(`/api/properties/${propertyId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls }),
        });

        if (!saveRes.ok) {
          const err = await saveRes.json();
          throw new Error(err.error || "שגיאה בשמירת התמונות");
        }

        toast.success(`${urls.length} תמונות הועלו בהצלחה`);
        onImagesChange();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(error instanceof Error ? error.message : "שגיאה בהעלאת התמונות");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [propertyId, onImagesChange]
  );

  const handleDelete = async (imageId: string) => {
    if (!confirm("למחוק את התמונה?")) return;

    setDeletingId(imageId);
    try {
      const res = await fetch(`/api/properties/${propertyId}/images/${imageId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("שגיאה במחיקה");
      }

      toast.success("התמונה נמחקה");
      onImagesChange();
    } catch (error) {
      toast.error("שגיאה במחיקת התמונה");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetFeatured = async (imageUrl: string) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/featured-image`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!res.ok) {
        throw new Error("שגיאה בעדכון");
      }

      toast.success("תמונה ראשית עודכנה");
      onImagesChange();
    } catch (error) {
      toast.error("שגיאה בעדכון התמונה הראשית");
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUpload(e.dataTransfer.files);
      }
    },
    [handleUpload]
  );

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            dragActive
              ? "border-gold-500 bg-gold/10 scale-[1.01]"
              : "border-gray-300 hover:border-gold-400 hover:bg-gray-50"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
            <p className="text-sm text-gray-600 font-medium">מעלה תמונות...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                גרור תמונות לכאן או לחץ לבחירה
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, WebP, GIF • עד 10MB לתמונה
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Images Grid */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {existingImages.map((image) => {
            const isFeatured = featuredImage === image.url;
            const isDeleting = deletingId === image.id;

            return (
              <div
                key={image.id}
                className={`
                  group relative rounded-xl overflow-hidden border-2 transition-all duration-200
                  ${isFeatured ? "border-gold-500 ring-2 ring-gold/30" : "border-gray-200 hover:border-gold-300"}
                  ${isDeleting ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                {/* Image */}
                <div className="aspect-square relative bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.alt || "תמונת נכס"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {/* Set as featured */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetFeatured(image.url);
                      }}
                      className={`
                        p-2 rounded-lg transition-colors
                        ${isFeatured ? "bg-gold text-primary" : "bg-white/90 text-gray-700 hover:bg-gold hover:text-primary"}
                      `}
                      title="הגדר כתמונה ראשית"
                    >
                      <Star className={`w-4 h-4 ${isFeatured ? "fill-current" : ""}`} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      className="p-2 rounded-lg bg-white/90 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      title="מחק תמונה"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute top-2 right-2 bg-gold text-primary text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    ראשית
                  </div>
                )}

                {/* Order number */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded">
                  {image.order + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {existingImages.length === 0 && !uploading && (
        <div className="text-center py-6 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">עדיין לא הועלו תמונות</p>
        </div>
      )}
    </div>
  );
}
