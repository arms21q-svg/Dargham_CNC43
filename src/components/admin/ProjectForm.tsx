"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectCategory } from "@/types";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { CATEGORY_LABELS } from "@/lib/categories";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { AiAssistPanel } from "@/components/admin/AiAssistPanel";
import { cn } from "@/lib/utils";

type FormState = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  category: ProjectCategory;
  imageList: string[];
  woodTypeAr: string;
  woodTypeEn: string;
  cncMachineAr: string;
  cncMachineEn: string;
  durationAr: string;
  durationEn: string;
  clientAr: string;
  clientEn: string;
  year: number;
  featured: boolean;
  slug: string;
};

function projectToForm(project?: Project): FormState {
  return {
    titleAr: project?.title.ar ?? "",
    titleEn: project?.title.en ?? "",
    descriptionAr: project?.description.ar ?? "",
    descriptionEn: project?.description.en ?? "",
    category: project?.category ?? "doors",
    imageList: project?.images ?? [],
    woodTypeAr: project?.woodType.ar ?? "",
    woodTypeEn: project?.woodType.en ?? "",
    cncMachineAr: project?.cncMachine.ar ?? "",
    cncMachineEn: project?.cncMachine.en ?? "",
    durationAr: project?.duration.ar ?? "",
    durationEn: project?.duration.en ?? "",
    clientAr: project?.client.ar ?? "",
    clientEn: project?.client.en ?? "",
    year: project?.year ?? new Date().getFullYear(),
    featured: project?.featured ?? false,
    slug: project?.slug ?? "",
  };
}

function formToPayload(form: FormState) {
  return {
    title: { ar: form.titleAr, en: form.titleEn },
    description: { ar: form.descriptionAr, en: form.descriptionEn },
    category: form.category,
    images: form.imageList,
    woodType: { ar: form.woodTypeAr, en: form.woodTypeEn },
    cncMachine: { ar: form.cncMachineAr, en: form.cncMachineEn },
    duration: { ar: form.durationAr, en: form.durationEn },
    client: { ar: form.clientAr, en: form.clientEn },
    year: form.year,
    featured: form.featured,
    ...(form.slug ? { slug: form.slug } : {}),
  };
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400/40";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export function ProjectForm({
  project,
  mode,
}: {
  project?: Project;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => projectToForm(project));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.imageList.length === 0) {
      setError("أضف صورة واحدة على الأقل");
      setLoading(false);
      return;
    }

    if (!form.titleAr.trim() && !form.titleEn.trim()) {
      setError("أدخل عنواناً بالعربية أو الإنجليزية على الأقل");
      setLoading(false);
      return;
    }

    const url =
      mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToPayload(form)),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "فشل الحفظ");
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
          {error}
        </div>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">العنوان والوصف</h2>
        <p className="text-xs text-gray-500">الحقول اختيارية ما عدا صورة واحدة على الأقل وعنوان (عربي أو إنجليزي)</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>العنوان (عربي)</label>
            <input className={inputClass} value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>العنوان (إنجليزي)</label>
            <input className={inputClass} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>الوصف (عربي) <span className="text-gray-400 font-normal">(اختياري)</span></label>
            <textarea className={cn(inputClass, "min-h-24")} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>الوصف (إنجليزي) <span className="text-gray-400 font-normal">(اختياري)</span></label>
            <textarea className={cn(inputClass, "min-h-24")} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} />
          </div>
        </div>
      </section>

      <AiAssistPanel
        titleAr={form.titleAr}
        titleEn={form.titleEn}
        category={form.category}
        woodTypeAr={form.woodTypeAr}
        woodTypeEn={form.woodTypeEn}
        descriptionAr={form.descriptionAr}
        descriptionEn={form.descriptionEn}
        onApply={(data) => {
          if (data.descriptionAr !== undefined) set("descriptionAr", data.descriptionAr);
          if (data.descriptionEn !== undefined) set("descriptionEn", data.descriptionEn);
          if (data.slug) set("slug", data.slug);
        }}
      />

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">التفاصيل</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>التصنيف</label>
            <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value as ProjectCategory)}>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c].ar}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>السنة <span className="text-gray-400 font-normal">(اختياري)</span></label>
            <input type="number" className={inputClass} value={form.year} onChange={(e) => set("year", Number(e.target.value))} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>صور العمل</label>
            <div className="mt-1">
              <ImagePicker
                images={form.imageList}
                onChange={(imageList) => set("imageList", imageList)}
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">الصورة الأولى تظهر كصورة رئيسية في المعرض والسلايدر</p>
          </div>
          <div>
            <label className={labelClass}>الرابط (slug) – اختياري</label>
            <input className={inputClass} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="luxury-door" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
              <span className="text-sm text-gray-700">عرض في السلايدر / المميز</span>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">مواصفات المشروع <span className="text-sm font-normal text-gray-400">(كلها اختيارية)</span></h2>
        <div className="grid md:grid-cols-2 gap-4">
          {(
            [
              ["woodTypeAr", "نوع الخشب (عربي)", "woodTypeEn", "نوع الخشب (إنجليزي)"],
              ["cncMachineAr", "ماكينة CNC (عربي)", "cncMachineEn", "ماكينة CNC (إنجليزي)"],
              ["durationAr", "المدة (عربي)", "durationEn", "المدة (إنجليزي)"],
              ["clientAr", "العميل (عربي)", "clientEn", "العميل (إنجليزي)"],
            ] as const
          ).map(([arKey, arLabel, enKey, enLabel]) => (
            <div key={arKey} className="contents">
              <div>
                <label className={labelClass}>{arLabel}</label>
                <input
                  className={inputClass}
                  value={form[arKey]}
                  onChange={(e) => set(arKey, e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>{enLabel}</label>
                <input
                  className={inputClass}
                  value={form[enKey]}
                  onChange={(e) => set(enKey, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : mode === "create" ? "إضافة العمل" : "حفظ التعديلات"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
