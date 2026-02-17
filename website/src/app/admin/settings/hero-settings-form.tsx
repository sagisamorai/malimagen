"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  Upload,
  Loader2,
  X,
  Sparkles,
  Building2,
  Home,
  Layers,
  TreePine,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import { updateHeroCategorySettings } from "@/actions/settings";
import type { HeroCategoryData } from "@/actions/settings";
import { Button } from "@/components/ui/Button";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  APARTMENT: <Building2 className="w-5 h-5" />,
  COTTAGE: <Home className="w-5 h-5" />,
  PENTHOUSE: <Layers className="w-5 h-5" />,
  GARDEN_APT: <TreePine className="w-5 h-5" />,
};

interface HeroSettingsFormProps {
  initialData: HeroCategoryData[];
}

export function HeroSettingsForm({ initialData }: HeroSettingsFormProps) {
  const [categories, setCategories] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageUpload = async (
    type: string,
    files: FileList | null
  ) => {
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

    setUploadingType(type);
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

      setCategories((prev) =>
        prev.map((cat) =>
          cat.type === type
            ? { ...cat, manualImage: url, image: url }
            : cat
        )
      );
      toast.success("התמונה הועלתה בהצלחה");
    } catch {
      toast.error("שגיאה בהעלאת התמונה");
    } finally {
      setUploadingType(null);
      const ref = fileInputRefs.current[type];
      if (ref) ref.value = "";
    }
  };

  const removeManualImage = (type: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.type === type
          ? { ...cat, manualImage: null, image: cat.autoImage }
          : cat
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: Record<string, string | null> = {};
      for (const cat of categories) {
        data[cat.type] = cat.manualImage;
      }
      const result = await updateHeroCategorySettings(data);
      if (result.success) {
        toast.success("הגדרות ה-Hero נשמרו בהצלחה");
      } else {
        toast.error(result.error || "שגיאה בשמירה");
      }
    } finally {
      setSaving(false);
    }
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
              <h2 className="text-lg font-bold text-primary">תמונות קטגוריות - Hero</h2>
              <p className="text-sm text-gray-500">
                הגדירי תמונה לכל קטגוריה שמופיעה ב-Hero בדף הבית. אם לא תעלי תמונה ידנית, 
                המערכת תשתמש אוטומטית בתמונה הראשית של נכס מאותה קטגוריה.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => {
              const isUploading = uploadingType === cat.type;
              const hasManualImage = !!cat.manualImage;
              const hasAutoImage = !!cat.autoImage;
              const displayImage = cat.image;

              return (
                <div
                  key={cat.type}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/30"
                >
                  {/* Category header */}
                  <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {CATEGORY_ICONS[cat.type]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-primary">{cat.label}</h3>
                      <p className="text-xs text-gray-400">
                        {cat.propertyCount} נכסים זמינים
                      </p>
                    </div>
                    {/* Status indicator */}
                    <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                      hasManualImage
                        ? "bg-blue-50 text-blue-600"
                        : hasAutoImage
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {hasManualImage ? "ידני" : hasAutoImage ? "אוטומטי" : "ללא תמונה"}
                    </div>
                  </div>

                  {/* Image preview */}
                  <div className="p-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 mb-3">
                      {displayImage ? (
                        <>
                          <Image
                            src={displayImage}
                            alt={cat.label}
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 right-3 text-white font-bold text-lg drop-shadow-lg">
                            {cat.label}
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-sm">אין תמונה</span>
                        </div>
                      )}
                    </div>

                    {/* Auto source info */}
                    {hasAutoImage && cat.sourceProperty && (
                      <div className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5 bg-gray-100/80 px-2.5 py-1.5 rounded-lg">
                        <RefreshCw className="w-3 h-3 shrink-0" />
                        <span>
                          מקור אוטומטי: <strong className="text-gray-600">{cat.sourceProperty.title}</strong>
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <input
                        ref={(el) => { fileInputRefs.current[cat.type] = el; }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(cat.type, e.target.files)
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRefs.current[cat.type]?.click()
                        }
                        disabled={isUploading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            מעלה...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {hasManualImage ? "החלף תמונה" : "העלה תמונה ידנית"}
                          </>
                        )}
                      </button>
                      {hasManualImage && (
                        <button
                          type="button"
                          onClick={() => removeManualImage(cat.type)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                          title="הסר תמונה ידנית וחזור לאוטומטי"
                        >
                          <X className="w-4 h-4" />
                          הסר
                        </button>
                      )}
                    </div>

                    {/* Help text */}
                    <p className="text-[10px] text-gray-400 mt-2">
                      {hasManualImage
                        ? "תמונה ידנית פעילה. לחצי ״הסר״ כדי לחזור לאוטומטי."
                        : hasAutoImage
                        ? "המערכת משתמשת אוטומטית בתמונת נכס. העלי תמונה ידנית כדי לדרוס."
                        : "אין נכסים עם תמונה בקטגוריה זו. העלי תמונה ידנית."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-500">תצוגה מקדימה - כך זה ייראה ב-Hero</h3>
        </div>
        <div className="p-6">
          <div className="bg-gradient-hero rounded-2xl p-6 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.type}
                  className="relative aspect-square rounded-xl overflow-hidden border border-white/10"
                >
                  {cat.image ? (
                    <>
                      <Image
                        src={cat.image}
                        alt={cat.label}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      cat.image ? "bg-gold/90 text-primary" : "bg-gold/20 text-gold"
                    }`}>
                      {CATEGORY_ICONS[cat.type]}
                    </div>
                    <span className="text-white font-bold text-xs drop-shadow-lg">
                      {cat.label}
                    </span>
                    {cat.propertyCount > 0 && (
                      <span className="mt-1 text-[9px] text-gold/90 bg-black/40 px-2 py-0.5 rounded-full">
                        {cat.propertyCount} נכסים
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <p className="text-white/50 text-xs mb-0.5">נכסים חמים ממתינים לכם</p>
              <p className="text-gold font-semibold text-sm">פסגות אפק, ראש העין</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} loading={saving} size="lg">
          <Save className="w-4 h-4" />
          שמור הגדרות Hero
        </Button>
      </div>
    </div>
  );
}
