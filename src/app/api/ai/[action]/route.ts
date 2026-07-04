import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data/projects";
import { aiGuard, aiErrorResponse } from "@/lib/ai/handler";
import {
  chatRequestSchema,
  searchRequestSchema,
  ideasRequestSchema,
  similarRequestSchema,
  estimateRequestSchema,
  colorsRequestSchema,
} from "@/lib/ai/schemas";
import {
  aiChat,
  aiSearch,
  aiIdeas,
  aiSimilar,
  aiEstimate,
  aiColors,
} from "@/lib/ai/service";

const ACTIONS = ["chat", "search", "ideas", "similar", "estimate", "colors"] as const;
type Action = (typeof ACTIONS)[number];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  if (!ACTIONS.includes(action as Action)) {
    return NextResponse.json({ error: "Unknown action" }, { status: 404 });
  }

  let locale: "ar" | "en" = "ar";

  try {
    const body = await request.json();
    locale = body.locale === "en" ? "en" : "ar";

    if (action === "estimate") {
      const parsed = estimateRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Validation failed" }, { status: 400 });
      }
      if (parsed.data.includeTips) {
        const guard = aiGuard(request, locale);
        if (guard) return guard;
      }
      const result = await aiEstimate(parsed.data);
      return NextResponse.json(result);
    }

    const projects = await getProjects();

    if (action === "search") {
      const parsed = searchRequestSchema.safeParse(body);
      if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
      return NextResponse.json(await aiSearch(parsed.data, projects));
    }

    const guard = aiGuard(request, locale);
    if (guard) return guard;

    switch (action as Action) {
      case "chat": {
        const parsed = chatRequestSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        return NextResponse.json(await aiChat(parsed.data));
      }
      case "ideas": {
        const parsed = ideasRequestSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        return NextResponse.json(await aiIdeas(parsed.data, projects));
      }
      case "similar": {
        const parsed = similarRequestSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        return NextResponse.json(await aiSimilar(parsed.data, projects));
      }
      case "colors": {
        const parsed = colorsRequestSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
        return NextResponse.json(await aiColors(parsed.data));
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 404 });
    }
  } catch (error) {
    return aiErrorResponse(error, locale);
  }
}
