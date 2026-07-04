import { PROJECT_CATEGORIES } from "@/lib/constants";
import type { Project, ProjectCategory } from "@/types";

export const CATEGORY_LABELS: Record<ProjectCategory, { ar: string; en: string }> = {
  decorations: { ar: "ديكورات", en: "Decorations" },
  doors: { ar: "أبواب", en: "Doors" },
  kitchens: { ar: "مطابخ", en: "Kitchens" },
  bedrooms: { ar: "غرف نوم", en: "Bedrooms" },
  furniture: { ar: "أثاث", en: "Furniture" },
  panels: { ar: "لوحات", en: "Panels" },
  special: { ar: "مشاريع خاصة", en: "Special Projects" },
};

/** تصنيفات لها أعمال فعلية — تظهر في الموقع فقط */
export function getActiveCategories(projects: Project[]): ProjectCategory[] {
  const used = new Set(projects.map((p) => p.category));
  return PROJECT_CATEGORIES.filter((cat) => used.has(cat));
}

export function categoryHasProjects(projects: Project[], category: ProjectCategory): boolean {
  return projects.some((p) => p.category === category);
}
