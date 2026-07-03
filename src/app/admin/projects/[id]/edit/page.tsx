import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjects } from "@/lib/data/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  return (
    <AdminShell title={`تعديل: ${project.title.ar}`}>
      <ProjectForm mode="edit" project={project} />
    </AdminShell>
  );
}
