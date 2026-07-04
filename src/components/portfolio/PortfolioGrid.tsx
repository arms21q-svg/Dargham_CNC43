"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/types";
import { getActiveCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as "ar" | "en";
  const activeCategories = useMemo(() => getActiveCategories(projects), [projects]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    if (activeCategory !== "all" && !activeCategories.includes(activeCategory as (typeof activeCategories)[number])) {
      setActiveCategory("all");
    }
  }, [activeCategory, activeCategories]);

  const filtered =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const categories = ["all", ...activeCategories];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-wood-dark text-white shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-gold/20 hover:text-foreground"
                )}
              >
                {t(cat as "all")}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            {locale === "ar" ? "لا توجد أعمال في هذا التصنيف حالياً." : "No projects in this category yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/projects/${project.slug}`}>
                  <div className="group rounded-xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ProjectImage
                        src={project.images[0]}
                        alt={project.title[locale]}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 start-4">
                        <span className="px-3 py-1 rounded-full bg-gold/90 text-wood-dark text-xs font-medium">
                          {t(project.category)}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-gold transition-colors">
                        {project.title[locale]}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {project.description[locale]}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
