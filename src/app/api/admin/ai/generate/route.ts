import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getProjects } from "@/lib/data/projects";
import { aiGuard, aiErrorResponse } from "@/lib/ai/handler";
import { adminGenerateSchema } from "@/lib/ai/schemas";
import { aiAdminGenerate } from "@/lib/ai/service";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const body = await request.json();
    const parsed = adminGenerateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const guard = aiGuard(request, "ar");
    if (guard) return guard;

    const projects = await getProjects();
    const result = await aiAdminGenerate(parsed.data, projects);
    return NextResponse.json(result);
  } catch (error) {
    return aiErrorResponse(error, "ar");
  }
}
