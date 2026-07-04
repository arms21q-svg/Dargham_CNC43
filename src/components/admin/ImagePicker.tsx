"use client";

import { useRef, useState } from "react";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Upload, Link2, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400/40";

interface ImagePickerProps {
  images: string[];
  onChange: (images: string[]) => void;
  required?: boolean;
}

export function ImagePicker({ images, onChange, required }: ImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http") && !url.startsWith("/")) {
      setError("أدخل رابطاً صحيحاً يبدأ بـ https:// أو /uploads/");
      return;
    }
    if (images.includes(url)) {
      setError("هذه الصورة مضافة مسبقاً");
      return;
    }
    onChange([...images, url]);
    setUrlInput("");
    setError("");
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "فشل رفع الصورة");
        setUploading(false);
        return;
      }
      newUrls.push(data.url);
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* رفع من الجهاز */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 text-center transition-colors",
            uploading ? "border-navy-300 bg-navy-50" : "border-gray-200 hover:border-navy-400 hover:bg-gray-50"
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => uploadFiles(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 text-gray-600 hover:text-navy-800 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-navy-600" />
            ) : (
              <Upload className="w-8 h-8 text-navy-500" />
            )}
            <span className="text-sm font-medium">
              {uploading ? "جاري الرفع..." : "رفع من الجهاز"}
            </span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP, GIF — حتى 5MB</span>
          </button>
        </div>

        {/* إضافة رابط */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Link2 className="w-4 h-4 text-navy-500" />
            إضافة برابط
          </div>
          <input
            type="url"
            className={inputClass}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          />
          <button
            type="button"
            onClick={addUrl}
            className="w-full py-2 text-sm font-medium text-navy-800 border border-navy-200 rounded-lg hover:bg-navy-50"
          >
            إضافة الرابط
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.some((src) => src.startsWith("/uploads/")) && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3">
          مسارات /uploads/ لا تعمل على Vercel بعد النشر. فعّل Vercel Blob وأعد رفع الصور، أو استخدم رابطاً خارجياً.
        </p>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <ProjectImage
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="120px"
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1.5 end-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                aria-label="حذف"
              >
                <X className="w-4 h-4" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 start-1.5 text-[10px] px-1.5 py-0.5 rounded bg-gold text-navy-900 font-medium">
                  رئيسية
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4">
          {required ? "أضف صورة واحدة على الأقل" : "لا توجد صور"}
        </p>
      )}
    </div>
  );
}
