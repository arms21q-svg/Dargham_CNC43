import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  locale: z.enum(["ar", "en"]).default("ar"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(800) }))
    .max(6)
    .optional(),
});

export const searchRequestSchema = z.object({
  query: z.string().min(1).max(200),
  locale: z.enum(["ar", "en"]).default("ar"),
});

export const ideasRequestSchema = z.object({
  locale: z.enum(["ar", "en"]).default("ar"),
  category: z.string().optional(),
  style: z.string().max(100).optional(),
});

export const similarRequestSchema = z.object({
  locale: z.enum(["ar", "en"]).default("ar"),
  imageBase64: z.string().min(100).max(4_000_000),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
});

export const estimateRequestSchema = z.object({
  locale: z.enum(["ar", "en"]).default("ar"),
  widthCm: z.number().positive().max(1000),
  heightCm: z.number().positive().max(1000),
  depthCm: z.number().positive().max(500).optional(),
  material: z.enum(["mdf", "plywood", "oak", "walnut", "beech", "melamine"]),
  category: z.enum([
    "decorations",
    "doors",
    "kitchens",
    "bedrooms",
    "furniture",
    "panels",
    "special",
  ]),
  complexity: z.enum(["simple", "medium", "complex"]).default("medium"),
  includeTips: z.boolean().optional(),
});

export const colorsRequestSchema = z.object({
  locale: z.enum(["ar", "en"]).default("ar"),
  category: z.string().optional(),
  roomType: z.string().max(80).optional(),
  mood: z.string().max(80).optional(),
});

export const adminGenerateSchema = z.object({
  type: z.enum(["description", "seo", "full"]),
  titleAr: z.string().optional(),
  titleEn: z.string().optional(),
  category: z.string().optional(),
  woodTypeAr: z.string().optional(),
  woodTypeEn: z.string().optional(),
  existingDescriptionAr: z.string().optional(),
  existingDescriptionEn: z.string().optional(),
});

export const searchResultSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum(["project", "service", "page"]),
      id: z.string(),
      slug: z.string().optional(),
      title: z.string(),
      snippet: z.string(),
      score: z.number(),
    })
  ),
});

export const ideasResultSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      materials: z.array(z.string()),
      category: z.string().optional(),
    })
  ),
});

export const colorsResultSchema = z.object({
  palette: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
      usage: z.string(),
    })
  ),
  materials: z.array(z.object({ name: z.string(), reason: z.string() })),
  tips: z.string(),
});

export const adminGenerateResultSchema = z.object({
  description: z.object({ ar: z.string(), en: z.string() }).optional(),
  seo: z
    .object({
      slug: z.string().optional(),
      metaTitle: z.object({ ar: z.string(), en: z.string() }).optional(),
      metaDescription: z.object({ ar: z.string(), en: z.string() }).optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
});
