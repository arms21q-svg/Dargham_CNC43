import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { getProjects } from "@/lib/data/projects";

export default async function PortfolioPage() {
  const projects = await getProjects();
  return <PortfolioGrid projects={projects} />;
}
