import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Eye, Target, Award, Search, Palette, Cog, CheckCircle } from "lucide-react";

const processSteps = [
  { key: "step1", icon: Search },
  { key: "step2", icon: Palette },
  { key: "step3", icon: Cog },
  { key: "step4", icon: CheckCircle },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-gold" />
              {t("story")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{t("storyText")}</p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <ProjectImage
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=80"
              alt="Workshop"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-card border border-border">
            <Eye className="w-10 h-10 text-gold mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">{t("vision")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("visionText")}</p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border">
            <Target className="w-10 h-10 text-gold mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">{t("mission")}</h3>
            <p className="text-muted-foreground leading-relaxed">{t("missionText")}</p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{t("process")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="text-center p-6 rounded-xl bg-muted/50 relative">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-gold font-bold text-sm">0{index + 1}</span>
                  <h4 className="font-semibold text-foreground mt-1">{t(step.key)}</h4>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{t("workshop")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
              "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
            ].map((src, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                <ProjectImage src={src} alt={`Workshop ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="33vw" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
