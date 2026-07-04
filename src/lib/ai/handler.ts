import { NextResponse } from "next/server";
import { AiUnavailableError, messageForReason } from "./errors";
import { isAiConfigured } from "./config";
import { getClientIp, isAiRateLimited } from "./rate-limit";

export function aiErrorResponse(error: unknown, locale: "ar" | "en" = "ar") {
  if (error instanceof AiUnavailableError) {
    return NextResponse.json(
      {
        error: messageForReason(error.reason, locale),
        unavailable: true,
        reason: error.reason,
      },
      { status: error.reason === "rate_limit" ? 429 : 503 }
    );
  }
  console.error("[AI]", error);
  return NextResponse.json({ error: "Request failed" }, { status: 500 });
}

export function aiGuard(request: Request, locale: "ar" | "en" = "ar") {
  if (!isAiConfigured()) {
    return NextResponse.json(
      {
        error: messageForReason("not_configured", locale),
        unavailable: true,
        reason: "not_configured",
      },
      { status: 503 }
    );
  }
  const ip = getClientIp(request);
  if (isAiRateLimited(ip)) {
    return NextResponse.json(
      {
        error: messageForReason("rate_limit", locale),
        unavailable: true,
        reason: "rate_limit",
      },
      { status: 429 }
    );
  }
  return null;
}
