"use client";

import { ThemeProvider } from "next-themes";
import { SiteSettingsProvider } from "./SiteSettingsProvider";
import type { SiteSettings } from "@/types";

export function Providers({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: SiteSettings;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SiteSettingsProvider settings={siteSettings}>{children}</SiteSettingsProvider>
    </ThemeProvider>
  );
}
