"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Save, Upload, Loader2, X, Sparkles, User } from "lucide-react";
import { updateHeroImage } from "@/actions/settings";
import { Button } from "@/components/ui/Button";

interface HeroSettingsFormProps {
  initialImage: string | null;
}

export function HeroSettingsForm({ initialImage }: HeroSettingsFormProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const saveImage = async (imageUrl: string | null) => {
    setSaving(true);
    try {
      const result = await updateHeroImage(imageUrl);
      if (result.success) {
        toast.success("תמונת ה-Hero נשמרה בהצלחה");
        router.refresh();
      } else {
        toast.error(result.error || "שגיאה בשמירה");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("סוג קובץ לא נתמך. נתמכים: JPG, PNG, WebP");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("הקובץ גדול מ-10MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("שגיאה בהעלאה");

      const data = await res.json();
      const url = data.files[0].url;
      setImage(url);
      await saveImage(url);
    } catch {
      toast.error("שגיאה בהעלאת התמונה");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setImage(null);
    await saveImage(null);
  };

  const handleSave = async () => {
    await saveImage(image);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">תמונת Hero - דף הבית</h2>
              <p className="text-sm text-gray-500">
                העלי תמונה שתופיע בצד שמאל של ה-Hero בדף הבית. מומלץ תמונה אנכית (פורטרט) באיכות גבוהה.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Preview */}
            <div className="shrink-0">
              <div className="relative w-64 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-sm">
                <div className="aspect-[3/4] relative">
                  {image ? (
                    <>
                      <Image
                        src={image}
                        alt="תמונת Hero"
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 left-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-gray-50 to-gray-100">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400 text-center px-4">
                        אין תמונה
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload controls */}
            <div className="flex-1 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-3 px-6 py-8 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-medium">מעלה...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span className="font-medium">
                      {image ? "החלפת תמונה" : "העלאת תמונה"}
                    </span>
                  </>
                )}
              </button>

              <div className="space-y-2 text-sm text-gray-400">
                <p>• JPG, PNG, WebP - עד 10MB</p>
                <p>• מומלץ: תמונה אנכית (פורטרט) באיכות גבוהה</p>
                <p>• יחס מומלץ: 3:4 (למשל 600x800 פיקסלים)</p>
                <p>• התמונה תופיע ב-Hero בדף הבית, בצד שמאל</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-500">תצוגה מקדימה</h3>
        </div>
        <div className="p-6">
          <div className="bg-gradient-hero rounded-2xl p-8 flex items-center gap-8">
            {/* Text side */}
            <div className="flex-1 text-right">
              <div className="text-gold text-xs font-medium mb-2">⭐ מומחית נדל״ן</div>
              <h3 className="text-2xl font-bold text-white mb-2">מוצאים לכם את הבית של החלומות</h3>
              <p className="text-white/50 text-sm">ליווי אישי וצמוד...</p>
            </div>
            {/* Image side */}
            <div className="relative w-32 shrink-0">
              <div className="rounded-xl overflow-hidden border border-white/10">
                <div className="aspect-[3/4] relative">
                  {image ? (
                    <Image src={image} alt="תצוגה מקדימה" fill className="object-cover" sizes="128px" />
                  ) : (
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                      <User className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} loading={saving} size="lg">
          <Save className="w-4 h-4" />
          שמור תמונת Hero
        </Button>
      </div>
    </div>
  );
}
