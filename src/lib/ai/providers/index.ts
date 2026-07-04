import { aiConfig } from "../config";
import { AiUnavailableError } from "../errors";
import { createGeminiProvider } from "./gemini";
import { createOpenRouterProvider } from "./openrouter";
import type { AiProvider } from "./base";

export function getAiProvider(): AiProvider {
  const gemini = createGeminiProvider();
  const openrouter = createOpenRouterProvider();

  if (aiConfig.provider === "gemini") {
    if (!gemini.isAvailable()) throw new AiUnavailableError("not_configured");
    return gemini;
  }
  if (aiConfig.provider === "openrouter") {
    if (!openrouter.isAvailable()) throw new AiUnavailableError("not_configured");
    return openrouter;
  }

  // auto: prefer Gemini free tier, fallback OpenRouter
  if (gemini.isAvailable()) return gemini;
  if (openrouter.isAvailable()) return openrouter;
  throw new AiUnavailableError("not_configured");
}

export async function withAiFallback<T>(fn: (provider: AiProvider) => Promise<T>): Promise<T> {
  const gemini = createGeminiProvider();
  const openrouter = createOpenRouterProvider();

  const order: AiProvider[] =
    aiConfig.provider === "openrouter"
      ? [openrouter, gemini]
      : aiConfig.provider === "gemini"
        ? [gemini, openrouter]
        : [gemini, openrouter];

  let lastError: unknown;
  for (const provider of order) {
    if (!provider.isAvailable()) continue;
    try {
      return await fn(provider);
    } catch (e) {
      lastError = e;
      if (e instanceof AiUnavailableError) continue;
      throw e;
    }
  }
  throw lastError instanceof AiUnavailableError ? lastError : new AiUnavailableError("not_configured");
}
