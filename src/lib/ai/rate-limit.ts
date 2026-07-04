import { aiConfig } from "./config";

const store = new Map<string, { count: number; timestamp: number }>();

export function isAiRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.timestamp > aiConfig.rateLimit.windowMs) {
    store.set(ip, { count: 1, timestamp: now });
    return false;
  }

  entry.count++;
  return entry.count > aiConfig.rateLimit.maxRequests;
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
