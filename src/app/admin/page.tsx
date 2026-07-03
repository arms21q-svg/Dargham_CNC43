import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/data/settings";
import { services, blogPosts, testimonials } from "@/data";

export default async function AdminDashboard() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  const stats = [
    { label: "الأعمال", value: projects.length, icon: FolderOpen },
    { label: "سلايدر الرئيسية", value: settings.sliderProjectIds.length, icon: Plus },
    { label: "الخدمات", value: services.length, icon: FolderOpen },
    { label: "المقالات", value: blogPosts.length, icon: FolderOpen },
    { label: "الآراء", value: testimonials.length, icon: FolderOpen },
  ];

  return (
    <AdminShell title="لوحة التحكم">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">آخر الأعمال</h2>
            <Link href="/admin/projects" className="text-sm text-navy-600 hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-900">{p.title.ar}</span>
                <span className="text-xs text-gray-500">{p.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">معلومات التواصل الحالية</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">الهاتف</dt>
              <dd className="font-medium text-gray-900">{settings.phoneDisplay}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">واتساب</dt>
              <dd className="font-medium text-gray-900">{settings.whatsappDisplay}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">العنوان</dt>
              <dd className="font-medium text-gray-900">{settings.address.ar}</dd>
            </div>
          </dl>
          <Link
            href="/admin/settings"
            className="inline-block mt-4 text-sm text-navy-600 hover:underline"
          >
            تعديل الإعدادات ←
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
