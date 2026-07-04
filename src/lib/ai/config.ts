/**
 * Google Gemini AI — modular configuration
 * @see https://ai.google.dev/gemini-api/docs
 */
export type AiProviderName = "gemini" | "openrouter";

function readGeminiKey() {
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
}

export const aiConfig = {
  /** Default: gemini (free Google AI Studio API) */
  provider: (process.env.AI_PROVIDER || "gemini") as AiProviderName | "auto",
  gemini: {
    apiKey: readGeminiKey(),
    model: process.env.AI_MODEL_GEMINI || "gemini-2.0-flash-lite",
    fallbackModels: ["gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash"],
  },
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.AI_MODEL_OPENROUTER || "google/gemini-2.0-flash-exp:free",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://dargham-cnc-43.vercel.app",
    siteName: "Dirgham CNC",
  },
  rateLimit: {
    maxRequests: Number(process.env.AI_RATE_LIMIT_PER_MINUTE || "8"),
    windowMs: 60_000,
  },
} as const;

/** True when Gemini API key is set (primary provider) */
export function isAiConfigured(): boolean {
  if (aiConfig.provider === "openrouter") {
    return Boolean(aiConfig.openrouter.apiKey);
  }
  if (aiConfig.provider === "auto") {
    return Boolean(aiConfig.gemini.apiKey || aiConfig.openrouter.apiKey);
  }
  return Boolean(aiConfig.gemini.apiKey);
}

export function getActiveProviderName(): "gemini" | "openrouter" | "none" {
  if (aiConfig.provider === "openrouter" && aiConfig.openrouter.apiKey) return "openrouter";
  if (aiConfig.gemini.apiKey) return "gemini";
  if (aiConfig.openrouter.apiKey) return "openrouter";
  return "none";
}
