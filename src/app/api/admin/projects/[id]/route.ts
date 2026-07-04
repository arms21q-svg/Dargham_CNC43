import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getProjects, updateProject, deleteProject } from "@/lib/data/projects";
import { revalidateSiteContent } from "@/lib/revalidate";
import type { ProjectInput } from "@/lib/data/projects";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<ProjectInput>;
    const project = await updateProject(id, body);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateSiteContent();
    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update";
    const status = message.includes("Vercel Blob") ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const { id } = await params;
  const deleted = await deleteProject(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidateSiteContent();
  return NextResponse.json({ success: true });
}
