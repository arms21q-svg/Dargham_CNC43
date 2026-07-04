"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, SiteSettings } from "@/types";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { CATEGORY_LABELS, categoryHasProjects } from "@/lib/categories";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400/40";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";

const optionalHint = <span className="text-gray-400 font-normal"> (اختياري)</span>;

export function SettingsForm({
  initial,
  projects,
}: {
  initial: SiteSettings;
  projects: Project[];
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSlider = (id: string) => {
    setForm((prev) => {
      const ids = prev.sliderProjectIds.includes(id)
        ? prev.sliderProjectIds.filter((x) => x !== id)
        : [...prev.sliderProjectIds, id];
      return { ...prev, sliderProjectIds: ids };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "فشل حفظ الإعدادات");
      setLoading(false);
      return;
    }

    setMessage("تم الحفظ بنجاح");
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
        جميع الحقول اختيارية — املأ ما تحتاجه فقط. التصنيفات في صفحة أعمالنا تظهر تلقائياً عند وجود منتجات وتختفي عند عدم وجودها.
      </p>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm border ${
            message.includes("فشل") || message.includes("يتطلب")
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-green-50 text-green-700 border-green-100"
          }`}
        >
          {message}
        </div>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">أرقام التواصل</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>الهاتف (للرابط){optionalHint}</label>
            <input className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+964..." />
          </div>
          <div>
            <label className={labelClass}>عرض الهاتف{optionalHint}</label>
            <input className={inputClass} value={form.phoneDisplay} onChange={(e) => set("phoneDisplay", e.target.value)} placeholder="077..." />
          </div>
          <div>
            <label className={labelClass}>واتساب (للرابط){optionalHint}</label>
            <input className={inputClass} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+964..." />
          </div>
          <div>
            <label className={labelClass}>عرض واتساب{optionalHint}</label>
            <input className={inputClass} value={form.whatsappDisplay} onChange={(e) => set("whatsappDisplay", e.target.value)} placeholder="077..." />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>البريد الإلكتروني{optionalHint}</label>
            <input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@example.com" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">موقع الشركة</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>العنوان (عربي){optionalHint}</label>
            <input className={inputClass} value={form.address.ar} onChange={(e) => set("address", { ...form.address, ar: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>العنوان (إنجليزي){optionalHint}</label>
            <input className={inputClass} value={form.address.en} onChange={(e) => set("address", { ...form.address, en: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>رابط الخريطة (Google Maps){optionalHint}</label>
            <input className={inputClass} value={form.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">تصنيفات أعمالنا في الموقع</h2>
        <p className="text-sm text-gray-500">
          يظهر التصنيف في صفحة أعمالنا فقط عند وجود منتج واحد على الأقل. احذف كل منتجات التصنيف ليختفي تلقائياً.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PROJECT_CATEGORIES.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length;
            const visible = categoryHasProjects(projects, cat);
            return (
              <div
                key={cat}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
                  visible ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                }`}
              >
                <span className="font-medium text-gray-800">{CATEGORY_LABELS[cat].ar}</span>
                <span className={visible ? "text-green-700" : "text-gray-400"}>
                  {visible ? `${count} أعمال · ظاهر` : "مخفي"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">سلايدر الصفحة الرئيسية{optionalHint}</h2>
        <p className="text-sm text-gray-500">اختر الأعمال التي تظهر في السلايدر (بالترتيب)</p>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-400">لا توجد أعمال بعد — أضف أعمالاً من قسم الأعمال.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {projects.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.sliderProjectIds.includes(p.id)}
                  onChange={() => toggleSlider(p.id)}
                />
                <span className="text-sm text-gray-800">{p.title.ar || p.title.en || "بدون عنوان"}</span>
                <span className="text-xs text-gray-400 ms-auto">{CATEGORY_LABELS[p.category].ar}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50"
      >
        {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </button>
    </form>
  );
}
