export const AI_UNAVAILABLE_MSG = {
  ar: "الخدمة غير متاحة مؤقتًا، يرجى المحاولة لاحقًا.",
  en: "Service temporarily unavailable. Please try again later.",
} as const;

export const AI_NOT_CONFIGURED_MSG = {
  ar: "لم يتم تفعيل الذكاء الاصطناعي على الخادم. أضف GEMINI_API_KEY في Vercel ثم أعد النشر.",
  en: "AI is not enabled on the server. Add GEMINI_API_KEY in Vercel and redeploy.",
} as const;

export const AI_RATE_LIMIT_MSG = {
  ar: "طلبات كثيرة — انتظر دقيقة ثم حاول مجدداً.",
  en: "Too many requests — wait a minute and try again.",
} as const;

export type AiErrorReason = "not_configured" | "rate_limit" | "quota" | "provider_error";

export class AiUnavailableError extends Error {
  reason: AiErrorReason;

  constructor(reason: AiErrorReason = "provider_error", message?: string) {
    super(message || AI_UNAVAILABLE_MSG.ar);
    this.name = "AiUnavailableError";
    this.reason = reason;
  }
}

export function isQuotaOrRateLimit(status: number, body?: string): boolean {
  if (status === 429 || status === 503) return true;
  if (status === 403 && body?.toLowerCase().includes("quota")) return true;
  const lower = body?.toLowerCase() || "";
  return (
    lower.includes("rate limit") ||
    lower.includes("resource exhausted") ||
    lower.includes("quota") ||
    lower.includes("too many requests")
  );
}

export function isInvalidApiKey(status: number, body?: string): boolean {
  const lower = body?.toLowerCase() || "";
  return (
    status === 401 ||
    status === 403 ||
    lower.includes("api key not valid") ||
    lower.includes("api_key_invalid") ||
    lower.includes("invalid api key") ||
    lower.includes("permission denied")
  );
}

export function messageForReason(reason: AiErrorReason, locale: "ar" | "en"): string {
  switch (reason) {
    case "not_configured":
      return locale === "ar" ? AI_NOT_CONFIGURED_MSG.ar : AI_NOT_CONFIGURED_MSG.en;
    case "rate_limit":
      return locale === "ar" ? AI_RATE_LIMIT_MSG.ar : AI_RATE_LIMIT_MSG.en;
    case "quota":
    case "provider_error":
      return locale === "ar" ? AI_UNAVAILABLE_MSG.ar : AI_UNAVAILABLE_MSG.en;
  }
}
