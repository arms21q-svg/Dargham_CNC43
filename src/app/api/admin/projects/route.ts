import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getProjects, createProject } from "@/lib/data/projects";
import { revalidateSiteContent } from "@/lib/revalidate";
import type { ProjectInput } from "@/lib/data/projects";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const body = (await request.json()) as ProjectInput;
    const project = await createProject(body);
    revalidateSiteContent();
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project" },
      { status: 400 }
    );
  }
}
