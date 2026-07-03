import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Calendar, User, Clock, TreePine, Cog, Phone, MessageCircle } from "lucide-react";
import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/data/settings";
import { buildContactLinks } from "@/lib/contact";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "project" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSettings()]);
  const contactLinks = buildContactLinks(settings);

  if (!project) notFound();

  const loc = locale as "ar" | "en";
  const Arrow = locale === "ar" ? ArrowRight : ArrowLeft;

  const details = [
    { icon: TreePine, label: t("woodType"), value: project.woodType[loc] },
    { icon: Cog, label: t("cncMachine"), value: project.cncMachine[loc] },
    { icon: Clock, label: t("duration"), value: project.duration[loc] },
    { icon: User, label: t("client"), value: project.client[loc] },
    { icon: Calendar, label: t("year"), value: String(project.year) },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold mb-8 transition-colors">
          <Arrow className="w-4 h-4" />
          {t("backToPortfolio")}
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
          {project.title[loc]}
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
              <ProjectImage
                src={project.images[0]}
                alt={project.title[loc]}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            {project.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                    <ProjectImage src={img} alt="" fill className="object-cover" sizes="33vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{t("description")}</h2>
            <p className="text-muted-foreground leading-relaxed">{project.description[loc]}</p>
            <div className="space-y-3 pt-4">
              {details.map((detail) => (
                <div key={detail.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <detail.icon className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className="font-medium text-foreground">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {project.beforeAfter && project.beforeAfter.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("beforeAfter")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {project.beforeAfter.map((ba, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Before</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <ProjectImage src={ba.before} alt="Before" fill className="object-cover" sizes="50vw" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">After</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <ProjectImage src={ba.after} alt="After" fill className="object-cover" sizes="50vw" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              {tCta("whatsapp")}
            </Button>
          </a>
          <a href={contactLinks.phone}>
            <Button size="lg" variant="outline" className="gap-2">
              <Phone className="w-5 h-5" />
              {tCta("call")}
            </Button>
          </a>
          <Link href="/contact">
            <Button size="lg">{locale === "ar" ? "تواصل معنا" : "Contact Us"}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
