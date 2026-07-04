import { aiConfig } from "../config";
import { AiUnavailableError, isInvalidApiKey, isQuotaOrRateLimit } from "../errors";
import type { AiProvider } from "./base";

async function parseGeminiResponse(res: Response): Promise<string> {
  const text = await res.text();

  if (!res.ok) {
    if (isInvalidApiKey(res.status, text)) {
      throw new AiUnavailableError("not_configured");
    }
    if (isQuotaOrRateLimit(res.status, text)) {
      throw new AiUnavailableError("quota");
    }
    console.error("[AI Gemini]", res.status, text.slice(0, 300));
    throw new Error(`Gemini error ${res.status}`);
  }

  const data = JSON.parse(text) as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
      finishReason?: string;
    }[];
    error?: { message?: string };
  };

  const candidate = data.candidates?.[0];
  const out = candidate?.content?.parts?.map((p) => p.text).join("") || "";

  if (!out) {
    const reason = candidate?.finishReason;
    console.error("[AI Gemini] empty response", reason);
    if (reason === "SAFETY") throw new AiUnavailableError("provider_error");
    throw new AiUnavailableError("quota");
  }

  return out;
}

async function geminiRequest(body: object, model: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseGeminiResponse(res);
}

function uniqueModels() {
  return [...new Set([aiConfig.gemini.model, ...aiConfig.gemini.fallbackModels])];
}

export function createGeminiProvider(): AiProvider {
  return {
    name: "gemini",
    isAvailable: () => Boolean(aiConfig.gemini.apiKey),
    async generateText(prompt, system) {
      const payload = {
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      };

      let lastError: unknown;
      for (const model of uniqueModels()) {
        try {
          return await geminiRequest(payload, model, aiConfig.gemini.apiKey);
        } catch (e) {
          lastError = e;
          if (e instanceof AiUnavailableError && e.reason === "not_configured") throw e;
          if (e instanceof AiUnavailableError && e.reason === "quota") throw e;
        }
      }
      throw lastError instanceof Error ? lastError : new AiUnavailableError("provider_error");
    },
    async generateWithImage(prompt, imageBase64, mimeType, system) {
      const payload = {
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: imageBase64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      };

      let lastError: unknown;
      for (const model of uniqueModels()) {
        try {
          return await geminiRequest(payload, model, aiConfig.gemini.apiKey);
        } catch (e) {
          lastError = e;
          if (e instanceof AiUnavailableError && (e.reason === "not_configured" || e.reason === "quota")) {
            throw e;
          }
        }
      }
      throw lastError instanceof Error ? lastError : new AiUnavailableError("provider_error");
    },
  };
}
