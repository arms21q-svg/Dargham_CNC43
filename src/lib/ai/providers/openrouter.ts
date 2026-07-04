import { aiConfig } from "../config";
import { AiUnavailableError, isInvalidApiKey, isQuotaOrRateLimit } from "../errors";
import type { AiProvider } from "./base";

async function chatCompletion(
  messages: { role: string; content: unknown }[]
): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${aiConfig.openrouter.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": aiConfig.openrouter.siteUrl,
      "X-Title": aiConfig.openrouter.siteName,
    },
    body: JSON.stringify({
      model: aiConfig.openrouter.model,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    if (isInvalidApiKey(res.status, text)) throw new AiUnavailableError("not_configured");
    if (isQuotaOrRateLimit(res.status, text)) throw new AiUnavailableError("quota");
    console.error("[AI OpenRouter]", res.status, text.slice(0, 300));
    throw new Error(`OpenRouter error ${res.status}`);
  }

  const data = JSON.parse(text) as { choices?: { message?: { content?: string } }[] };
  const out = data.choices?.[0]?.message?.content || "";
  if (!out) throw new AiUnavailableError("quota");
  return out;
}

export function createOpenRouterProvider(): AiProvider {
  return {
    name: "openrouter",
    isAvailable: () => Boolean(aiConfig.openrouter.apiKey),
    async generateText(prompt, system) {
      const messages = [
        ...(system ? [{ role: "system", content: system }] : []),
        { role: "user", content: prompt },
      ];
      return chatCompletion(messages);
    },
    async generateWithImage(prompt, imageBase64, mimeType, system) {
      const dataUrl = `data:${mimeType};base64,${imageBase64}`;
      const messages = [
        ...(system ? [{ role: "system", content: system }] : []),
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ];
      return chatCompletion(messages);
    },
  };
}
