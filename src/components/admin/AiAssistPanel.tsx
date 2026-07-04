"use client";

import { useState } from "react";
import { Sparkles, Loader2, Wand2, SearchCheck } from "lucide-react";
import type { ProjectCategory } from "@/types";

interface AiAssistPanelProps {
  titleAr: string;
  titleEn: string;
  category: ProjectCategory;
  woodTypeAr: string;
  woodTypeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  onApply: (data: {
    descriptionAr?: string;
    descriptionEn?: string;
    slug?: string;
    seoNote?: string;
  }) => void;
}

export function AiAssistPanel(props: AiAssistPanelProps) {
  const [loading, setLoading] = useState<"description" | "seo" | "full" | null>(null);
  const [message, setMessage] = useState("");
  const [seoPreview, setSeoPreview] = useState("");

  const generate = async (type: "description" | "seo" | "full") => {
    setLoading(type);
    setMessage("");
    setSeoPreview("");

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          titleAr: props.titleAr,
          titleEn: props.titleEn,
          category: props.category,
          woodTypeAr: props.woodTypeAr,
          woodTypeEn: props.woodTypeEn,
          existingDescriptionAr: props.descriptionAr,
          existingDescriptionEn: props.descriptionEn,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.unavailable) {
        setMessage(data.error || "الخدمة غير متاحة مؤقتًا، يرجى المحاولة لاحقًا.");
        return;
      }

      const updates: Parameters<AiAssistPanelProps["onApply"]>[0] = {};
      if (data.description) {
        updates.descriptionAr = data.description.ar;
        updates.descriptionEn = data.description.en;
      }
      if (data.seo?.slug) updates.slug = data.seo.slug;

      if (data.seo) {
        const lines = [
          data.seo.metaTitle?.ar && `عنوان SEO: ${data.seo.metaTitle.ar}`,
          data.seo.metaDescription?.ar && `وصف SEO: ${data.seo.metaDescription.ar}`,
          data.seo.keywords?.length && `كلمات: ${data.seo.keywords.join(", ")}`,
        ].filter(Boolean);
        setSeoPreview(lines.join("\n"));
      }

      props.onApply(updates);
      setMessage("تم التوليد — راجع الحقول قبل الحفظ");
    } catch {
      setMessage("الخدمة غير متاحة مؤقتًا، يرجى المحاولة لاحقًا.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-navy-50 to-gold/5 rounded-xl border border-navy-100 p-4 space-y-3">
      <div className="flex items-center gap-2 text-navy-800 font-bold text-sm">
        <Sparkles className="w-4 h-4 text-gold" />
        مساعد الذكاء الاصطناعي
      </div>
      <p className="text-xs text-gray-500">يولّد وصفاً احترافياً واقتراحات SEO — اختياري، لا يحفظ تلقائياً</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!!loading} onClick={() => generate("description")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 text-white text-xs font-medium hover:bg-navy-700 disabled:opacity-50">
          {loading === "description" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          إنشاء وصف
        </button>
        <button type="button" disabled={!!loading} onClick={() => generate("seo")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-200 text-navy-800 text-xs font-medium hover:bg-navy-50 disabled:opacity-50">
          {loading === "seo" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SearchCheck className="w-3.5 h-3.5" />}
          تحسين SEO
        </button>
        <button type="button" disabled={!!loading} onClick={() => generate("full")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/40 text-navy-800 text-xs font-medium hover:bg-gold/10 disabled:opacity-50">
          {loading === "full" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          وصف + SEO
        </button>
      </div>
      {message && <p className={`text-xs ${message.includes("غير متاحة") ? "text-red-600" : "text-green-700"}`}>{message}</p>}
      {seoPreview && <pre className="text-xs text-gray-600 bg-white rounded-lg p-2 border border-gray-100 whitespace-pre-wrap">{seoPreview}</pre>}
    </div>
  );
}
