import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { getSettings, updateSettings } from "@/lib/data/settings";
import { revalidateSiteContent } from "@/lib/revalidate";
import type { SiteSettings } from "@/types";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  try {
    const body = (await request.json()) as Partial<SiteSettings>;
    const settings = await updateSettings(body);
    revalidateSiteContent();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update settings" },
      { status: 400 }
    );
  }
}
