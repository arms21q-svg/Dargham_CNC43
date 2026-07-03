import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { getProjects } from "@/lib/data/projects";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return <ProjectsTable projects={projects} />;
}
