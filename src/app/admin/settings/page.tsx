import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/data/settings";

export default async function AdminSettingsPage() {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);

  return (
    <AdminShell title="إعدادات الموقع">
      <SettingsForm initial={settings} projects={projects} />
    </AdminShell>
  );
}
