import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { blogPosts } from "@/data";
import { getProjects } from "@/lib/data/projects";

const BASE_URL = "https://dirgham-cnc.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const staticPages = ["", "/portfolio", "/services", "/about", "/blog", "/faq", "/contact", "/privacy", "/terms"];

  const localePages = routing.locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  const projectPages = routing.locales.flatMap((locale) =>
    projects.map((p) => ({
      url: `${BASE_URL}/${locale}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const blogPages = routing.locales.flatMap((locale) =>
    blogPosts.map((p) => ({
      url: `${BASE_URL}/${locale}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [...localePages, ...projectPages, ...blogPages];
}
