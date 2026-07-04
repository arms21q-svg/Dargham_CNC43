import { NextResponse } from "next/server";
import { getActiveProviderName, isAiConfigured } from "@/lib/ai/config";

export async function GET() {
  return NextResponse.json({
    configured: isAiConfigured(),
    provider: getActiveProviderName(),
  });
}
