import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProjects, getProjectsByCategory } from "@/lib/data/projects";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { categoryHasProjects } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjects();
  return PROJECT_CATEGORIES.filter((category) => categoryHasProjects(projects, category)).map(
    (category) => ({ category })
  );
}

export default async function PortfolioCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!PROJECT_CATEGORIES.includes(category as (typeof PROJECT_CATEGORIES)[number])) {
    notFound();
  }

  const projects = await getProjectsByCategory(category);
  if (projects.length === 0) notFound();

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const loc = locale as "ar" | "en";

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading title={t(category as "decorations")} subtitle={t("subtitle")} />

        <div className="mb-8">
          <Link href="/portfolio" className="text-gold hover:underline text-sm">
            ← {t("all")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <div className="group rounded-xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ProjectImage
                    src={project.images[0]}
                    alt={project.title[loc]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-gold transition-colors">
                    {project.title[loc]}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {project.description[loc]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
