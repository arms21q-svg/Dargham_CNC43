import type { Project } from "@/types";
import { AiUnavailableError } from "./errors";
import { isAiConfigured } from "./config";
import { CNC_SYSTEM_PROMPT, buildPortfolioContext, buildSearchIndex } from "./context";
import { calculateEstimate } from "./pricing";
import {
  adminGenerateResultSchema,
  colorsResultSchema,
  ideasResultSchema,
  searchResultSchema,
  type adminGenerateSchema,
  type chatRequestSchema,
  type colorsRequestSchema,
  type estimateRequestSchema,
  type ideasRequestSchema,
  type searchRequestSchema,
  type similarRequestSchema,
} from "./schemas";
import type { z } from "zod";
import { withAiFallback } from "./providers";

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : text.trim();
  const start = raw.indexOf("{");
  const arrStart = raw.indexOf("[");
  const jsonStart = start === -1 ? arrStart : arrStart === -1 ? start : Math.min(start, arrStart);
  if (jsonStart === -1) return JSON.parse(raw);
  let depth = 0;
  let end = jsonStart;
  const open = raw[jsonStart];
  const close = open === "[" ? "]" : "}";
  for (let i = jsonStart; i < raw.length; i++) {
    if (raw[i] === open) depth++;
    if (raw[i] === close) depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
  return JSON.parse(raw.slice(jsonStart, end + 1));
}

function localSearch(
  query: string,
  index: ReturnType<typeof buildSearchIndex>,
  locale: "ar" | "en"
) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  return index
    .map((item) => {
      const text = item.text.toLowerCase();
      const title = locale === "ar" ? item.titleAr : item.titleEn;
      let score = 0;
      for (const w of words) {
        if (text.includes(w)) score += 2;
        if (title.toLowerCase().includes(w)) score += 3;
      }
      return {
        type: item.type,
        id: item.id,
        slug: item.slug,
        title,
        snippet: item.text.slice(0, 120),
        score,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export async function aiChat(input: z.infer<typeof chatRequestSchema>) {
  const historyText = (input.history || [])
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
  const prompt = `${historyText ? `Previous:\n${historyText}\n\n` : ""}User (${input.locale}): ${input.message}`;
  const reply = await withAiFallback((p) =>
    p.generateText(prompt, CNC_SYSTEM_PROMPT)
  );
  return { reply: reply.trim() };
}

export async function aiSearch(
  input: z.infer<typeof searchRequestSchema>,
  projects: Project[]
) {
  const index = buildSearchIndex(projects);
  const fallback = localSearch(input.query, index, input.locale);

  if (!isAiConfigured()) {
    return { results: fallback };
  }

  try {
    const indexJson = JSON.stringify(index.slice(0, 40));
    const prompt = `Query (${input.locale}): "${input.query}"
Search index: ${indexJson}
Return ONLY JSON: {"results":[{"type":"project|service|page","id":"...","slug":"...","title":"...","snippet":"...","score":0.0}]}
Max 6 results, semantic matching allowed.`;
    const raw = await withAiFallback((p) => p.generateText(prompt, CNC_SYSTEM_PROMPT));
    const parsed = searchResultSchema.safeParse(extractJson(raw));
    if (parsed.success && parsed.data.results.length > 0) {
      return parsed.data;
    }
  } catch {
    // fallback below
  }
  return { results: fallback };
}

export async function aiIdeas(
  input: z.infer<typeof ideasRequestSchema>,
  projects: Project[]
) {
  const portfolio = buildPortfolioContext(projects);
  const prompt = `Language: ${input.locale}
Category preference: ${input.category || "any"}
Style: ${input.style || "modern CNC woodwork"}
Portfolio sample: ${JSON.stringify(portfolio.slice(0, 12))}
Generate 4 creative CNC wood design ideas inspired by the portfolio.
Return ONLY JSON: {"ideas":[{"title":"...","description":"...","materials":["..."],"category":"..."}]}`;
  const raw = await withAiFallback((p) => p.generateText(prompt, CNC_SYSTEM_PROMPT));
  const parsed = ideasResultSchema.safeParse(extractJson(raw));
  if (!parsed.success) throw new Error("Invalid AI response");
  return parsed.data;
}

export async function aiSimilar(
  input: z.infer<typeof similarRequestSchema>,
  projects: Project[]
) {
  const portfolio = buildPortfolioContext(projects);
  const prompt = `Describe this image briefly (style, wood, category, colors) then pick up to 5 most similar project IDs from:
${JSON.stringify(portfolio)}
Return ONLY JSON: {"description":"...","projectIds":["id1","id2"]}`;
  const raw = await withAiFallback((p) =>
    p.generateWithImage(prompt, input.imageBase64, input.mimeType, CNC_SYSTEM_PROMPT)
  );
  const data = extractJson(raw) as { description?: string; projectIds?: string[] };
  const ids = data.projectIds || [];
  const matched = ids
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean)
    .map((p) => ({
      id: p!.id,
      slug: p!.slug,
      title: input.locale === "ar" ? p!.title.ar : p!.title.en,
      image: p!.images[0],
      category: p!.category,
    }));
  return { description: data.description || "", projects: matched };
}

export async function aiEstimate(input: z.infer<typeof estimateRequestSchema>) {
  const estimate = calculateEstimate(input);
  let tips: string | undefined;
  if (input.includeTips) {
    try {
      const prompt = `Brief tip (2 sentences, ${input.locale}) for CNC ${input.category} in ${input.material}, ${input.complexity} complexity.`;
      tips = await withAiFallback((p) => p.generateText(prompt, CNC_SYSTEM_PROMPT));
    } catch {
      tips = undefined;
    }
  }
  return { estimate, tips };
}

export async function aiColors(input: z.infer<typeof colorsRequestSchema>) {
  const prompt = `Language for text fields: ${input.locale}
Room/category: ${input.category || "general"} / ${input.roomType || "living"}
Mood: ${input.mood || "warm modern"}
Suggest wood CNC color palette and materials.
Return ONLY JSON: {"palette":[{"name":"...","hex":"#...","usage":"..."}],"materials":[{"name":"...","reason":"..."}],"tips":"..."}`;
  const raw = await withAiFallback((p) => p.generateText(prompt, CNC_SYSTEM_PROMPT));
  const parsed = colorsResultSchema.safeParse(extractJson(raw));
  if (!parsed.success) throw new Error("Invalid AI response");
  return parsed.data;
}

export async function aiAdminGenerate(
  input: z.infer<typeof adminGenerateSchema>,
  projects: Project[]
) {
  const samples = buildPortfolioContext(projects).slice(0, 5);
  const prompt = `Generate professional bilingual content for a CNC wood project.
Title AR: ${input.titleAr || ""}
Title EN: ${input.titleEn || ""}
Category: ${input.category || ""}
Wood AR: ${input.woodTypeAr || ""} / EN: ${input.woodTypeEn || ""}
Existing desc AR: ${input.existingDescriptionAr || ""}
Existing desc EN: ${input.existingDescriptionEn || ""}
Type requested: ${input.type}
Portfolio style reference: ${JSON.stringify(samples)}
Return ONLY JSON matching:
{"description":{"ar":"...","en":"..."},"seo":{"slug":"...","metaTitle":{"ar":"...","en":"..."},"metaDescription":{"ar":"...","en":"..."},"keywords":["..."]}}
Omit fields not needed for type "${input.type}".`;
  const raw = await withAiFallback((p) => p.generateText(prompt, CNC_SYSTEM_PROMPT));
  const parsed = adminGenerateResultSchema.safeParse(extractJson(raw));
  if (!parsed.success) throw new Error("Invalid AI response");
  return parsed.data;
}
