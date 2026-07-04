import { unstable_noStore as noStore } from "next/cache";
import type { SiteSettings } from "@/types";
import { defaultSiteSettings } from "@/data/seed";
import { readJson, writeJson } from "./storage";

const SETTINGS_KEY = "settings.json";

export async function getSettings(): Promise<SiteSettings> {
  noStore();
  const data = await readJson<SiteSettings>(SETTINGS_KEY, defaultSiteSettings);
  return { ...defaultSiteSettings, ...data };
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await writeJson(SETTINGS_KEY, updated);
  return updated;
}
