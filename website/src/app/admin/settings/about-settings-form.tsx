"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Save, Upload, Loader2, User, X, ImageIcon, Check, Ban } from "lucide-react";
import { updateAboutSettings } from "@/actions/settings";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// Free background images from Unsplash (royalty-free for commercial use)
const BACKGROUND_LIBRARY = [
  {
    id: "city-skyline",
    label: "קו רקיע עירוני",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=60",
  },
  {
    id: "buildings-up",
    label: "בניינים מלמטה",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=60",
  },
  {
    id: "modern-building",
    label: "בניין מודרני",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=60",
  },
  {
    id: "night-city",
    label: "עיר בלילה",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&q=60",
  },
  {
    id: "luxury-interior",
    label: "פנים יוקרתי",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60",
  },
  {
    id: "apartment-building",
    label: "בניין מגורים",
    url: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400&q=60",
  },
  {
    id: "glass-building",
    label: "בניין זכוכית",
    url: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&q=60",
  },
  {
    id: "dark-abstract",
    label: "מופשט כהה",
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=60",
  },
  {
    id: "marble",
    label: "שיש כהה",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=60",
  },
  {
    id: "gold-dark",
    label: "זהב וכהה",
    url: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1920&q=80",
    thumb: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&q=60",
  },
];

interface AboutSettingsFormProps {
  initialData: {
    title: string;
    text: string;
    image: string | null;
    background: string | null;
  };
}

export function AboutSettingsForm({ initialData }: AboutSettingsFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [text, setText] = useState(initialData.text);
  const [image, setImage] = useState<string | null>(initialData.image);
  const [background, setBackground] = useState<string | null>(initialData.background);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("סוג קובץ לא נתמך. נתמכים: JPG, PNG, WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("הקובץ גדול מ-5MB");
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
      setImage(data.files[0].url);
      toast.success("התמונה הועלתה בהצלחה");
    } catch {
      toast.error("שגיאה בהעלאת התמונה");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleBgUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("סוג קובץ לא נתמך");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("הקובץ גדול מ-10MB");
      return;
    }

    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("שגיאה בהעלאה");

      const data = await res.json();
      setBackground(data.files[0].url);
      toast.success("תמונת רקע הועלתה בהצלחה");
    } catch {
      toast.error("שגיאה בהעלאת התמונה");
    } finally {
      setUploadingBg(false);
      if (bgFileInputRef.current) bgFileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("כותרת נדרשת");
      return;
    }
    if (!text.trim()) {
      toast.error("טקסט נדרש");
      return;
    }

    setSaving(true);
    try {
      const result = await updateAboutSettings({ title, text, image, background });
      if (result.success) {
        toast.success("ההגדרות נשמרו בהצלחה");
      } else {
        toast.error(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* About Me Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">קצת עליי</h2>
              <p className="text-sm text-gray-500">עדכני את הטקסט, התמונה והרקע שמופיעים בסקשן ״קצת עליי״</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              תמונת פרופיל
            </label>
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                  {image ? (
                    <Image src={image} alt="תמונת פרופיל" width={112} height={112} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                      <User className="w-10 h-10 text-primary-400" />
                    </div>
                  )}
                </div>
                {image && (
                  <button type="button" onClick={() => setImage(null)}
                    className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)} />
                <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? (<><Loader2 className="w-4 h-4 animate-spin" />מעלה...</>) : (<><Upload className="w-4 h-4" />העלאת תמונה</>)}
                </Button>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP • עד 5MB • מומלץ תמונה מרובעת</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <Input label="כותרת" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="קצת עליי" />
          </div>

          {/* Bio Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">טקסט אודות</label>
            <p className="text-xs text-gray-400 mb-2">כתבי על עצמך, הניסיון שלך, ההשכלה והערכים. כל שורה ריקה = פסקה חדשה.</p>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={14}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm leading-relaxed resize-y"
              placeholder="היי, נעים להכיר..." dir="rtl" />
            <p className="text-xs text-gray-400 mt-1.5">
              {text.split("\n").filter((p) => p.trim()).length} פסקאות • {text.length} תווים
            </p>
          </div>
        </div>
      </div>

      {/* Background Image Picker */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">תמונת רקע</h2>
              <p className="text-sm text-gray-500">בחרי תמונת רקע מהספרייה או העלי תמונה משלך. התמונה תהיה מושחרת כדי שהטקסט יהיה קריא.</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* No background option */}
          <div className="flex items-center gap-3 mb-2">
            <button
              type="button"
              onClick={() => setBackground(null)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                !background
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Ban className="w-4 h-4" />
              ללא תמונת רקע (גרדיאנט כהה)
            </button>

            <div>
              <input ref={bgFileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => handleBgUpload(e.target.files)} />
              <button
                type="button"
                onClick={() => bgFileInputRef.current?.click()}
                disabled={uploadingBg}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-all"
              >
                {uploadingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                העלאת תמונה משלך
              </button>
            </div>
          </div>

          {/* Custom uploaded background preview */}
          {background && !BACKGROUND_LIBRARY.some((bg) => bg.url === background) && (
            <div className="relative rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary/20 h-32 w-56">
              <Image src={background} alt="רקע מותאם" fill className="object-cover" sizes="224px" />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute bottom-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <Check className="w-3 h-3" /> רקע מותאם
              </div>
            </div>
          )}

          {/* Background library grid */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-3">ספריית תמונות חינמיות:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {BACKGROUND_LIBRARY.map((bg) => {
                const isSelected = background === bg.url;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBackground(bg.url)}
                    className={`group relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={bg.thumb}
                      alt={bg.label}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {/* Dark overlay preview */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Label */}
                    <div className="absolute bottom-0 inset-x-0 p-1.5 text-center">
                      <span className="text-white text-[10px] font-medium">{bg.label}</span>
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">תמונות מ-Unsplash • חינמיות לשימוש מסחרי</p>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-500">תצוגה מקדימה</h3>
        </div>
        <div className="p-0">
          <div className="relative rounded-b-xl overflow-hidden">
            {/* Background */}
            {background ? (
              <>
                <Image src={background} alt="רקע" fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-black/70" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a2e] via-[#0f2137] to-[#0b1a2e]" />
            )}

            <div className="relative z-10 p-8 md:p-12">
              {/* Profile */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/50">
                  {image ? (
                    <Image src={image} alt="תצוגה מקדימה" width={96} height={96} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">מ</span>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gold text-center mb-6">{title || "קצת עליי"}</h3>
              <div className="space-y-3 max-w-2xl mx-auto">
                {text.split("\n").filter((p) => p.trim()).map((paragraph, i) => (
                  <p key={i} className="text-gray-300 text-sm leading-relaxed text-center">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} loading={saving} size="lg">
          <Save className="w-4 h-4" />
          שמור שינויים
        </Button>
      </div>
    </div>
  );
}
