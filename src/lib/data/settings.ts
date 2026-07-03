import fs from "fs/promises";
import { unstable_noStore as noStore } from "next/cache";
import type { SiteSettings } from "@/types";
import { defaultSiteSettings } from "@/data/seed";
import { DATA_DIR, SETTINGS_FILE } from "./paths";

async function ensureSettingsFile() {
  try {
    await fs.access(SETTINGS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(defaultSiteSettings, null, 2), "utf-8");
  }
}

export async function getSettings(): Promise<SiteSettings> {
  noStore();
  await ensureSettingsFile();
  const raw = await fs.readFile(SETTINGS_FILE, "utf-8");
  return { ...defaultSiteSettings, ...JSON.parse(raw) };
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
