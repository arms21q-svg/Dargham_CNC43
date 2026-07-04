import { unstable_noStore as noStore } from "next/cache";
import type { Project, ProjectCategory } from "@/types";
import { seedProjects } from "@/data/seed";
import { readJson, writeJson, ensureLocalSeed } from "./storage";

const PROJECTS_KEY = "projects.json";

async function loadProjects(): Promise<Project[]> {
  await ensureLocalSeed(PROJECTS_KEY, seedProjects);
  return readJson<Project[]>(PROJECTS_KEY, seedProjects);
}

async function saveProjects(projects: Project[]) {
  await writeJson(PROJECTS_KEY, projects);
}

export async function getProjects(): Promise<Project[]> {
  noStore();
  return loadProjects();
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getProjects();
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getSliderProjects(sliderIds: string[]): Promise<Project[]> {
  const projects = await getProjects();
  if (sliderIds.length === 0) return projects.filter((p) => p.featured);
  return sliderIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export type ProjectInput = Omit<Project, "id" | "slug"> & { slug?: string };

export async function createProject(input: ProjectInput): Promise<Project> {
  const projects = await getProjects();
  const id = String(Date.now());
  const baseSlug = input.slug || slugify(input.title.en || input.title.ar);
  let slug = baseSlug || `project-${id}`;
  let i = 1;
  while (projects.some((p) => p.slug === slug)) {
    slug = `${baseSlug || "project"}-${i++}`;
  }

  const project: Project = { ...input, id, slug };
  projects.push(project);
  await saveProjects(projects);
  return project;
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = projects[index];
  let slug = current.slug;
  if (input.slug && input.slug !== current.slug) {
    slug = input.slug;
    if (projects.some((p) => p.slug === slug && p.id !== id)) {
      throw new Error("Slug already exists");
    }
  }

  const updated: Project = {
    ...current,
    ...input,
    id: current.id,
    slug,
    category: (input.category ?? current.category) as ProjectCategory,
  };
  projects[index] = updated;
  await saveProjects(projects);
  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  await saveProjects(filtered);
  return true;
}
