"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectSlider({ projects }: { projects: Project[] }) {
  const t = useTranslations("gallery");
  const tPortfolio = useTranslations("portfolio");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % projects.length);
  }, [projects.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (projects.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, projects.length]);

  if (projects.length === 0) return null;

  const current = projects[index];
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="relative max-w-5xl mx-auto">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden border border-navy-600/10 shadow-lg bg-navy-900">
            <Link href={`/projects/${current.slug}`} className="relative block w-full h-full group">
              <ProjectImage
                key={current.id}
                src={current.images[0]}
                alt={current.title[locale]}
                fill
                className="object-cover transition-opacity duration-500 group-hover:scale-[1.02] transition-transform"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold/90 text-navy-900 text-xs font-medium mb-2">
                  {tPortfolio(current.category)}
                </span>
                <h3 className="text-white font-bold text-xl md:text-2xl mb-1">
                  {current.title[locale]}
                </h3>
                <p className="text-white/70 text-sm line-clamp-2 max-w-xl hidden sm:block">
                  {current.description[locale]}
                </p>
              </div>
            </Link>

            {projects.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute top-1/2 start-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-navy-800 flex items-center justify-center shadow z-10"
                  aria-label="Previous"
                >
                  <PrevIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute top-1/2 end-3 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-navy-800 flex items-center justify-center shadow z-10"
                  aria-label="Next"
                >
                  <NextIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {projects.length > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-7 bg-gold" : "w-1.5 bg-navy-400/30"
                  )}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link href="/portfolio">
            <Button variant="outline">{t("viewAll")}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
