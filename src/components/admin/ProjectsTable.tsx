"use client";

import Link from "next/link";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Project } from "@/types";
import { CATEGORY_LABELS } from "@/lib/categories";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();

  const remove = async (id: string, title: string) => {
    if (!confirm(`حذف "${title}"؟`)) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("فشل الحذف");
  };

  return (
    <AdminShell
      title="إدارة الأعمال"
      action={
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة عمل
        </Link>
      }
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-start px-6 py-3 text-xs font-medium text-gray-500 uppercase">صورة</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-gray-500 uppercase">العنوان</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-gray-500 uppercase">التصنيف</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-gray-500 uppercase">مميز</th>
              <th className="text-start px-6 py-3 text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {p.images[0] && (
                      <ProjectImage src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{p.title.ar}</p>
                  <p className="text-xs text-gray-400">{p.title.en}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{CATEGORY_LABELS[p.category].ar}</td>
                <td className="px-6 py-4">
                  {p.featured ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark">نعم</span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(p.id, p.title.ar)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <p className="text-center text-gray-500 py-12">لا توجد أعمال بعد</p>
        )}
      </div>
    </AdminShell>
  );
}
