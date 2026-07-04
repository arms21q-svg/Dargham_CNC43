import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectImage } from "@/components/ui/ProjectImage";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { services } from "@/data";
import {
  Scissors, PenTool, Sparkles, ChefHat, DoorOpen,
  Bed, Armchair, LayoutGrid, PencilRuler, ArrowRight, ArrowLeft,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scissors, PenTool, Sparkles, ChefHat, DoorOpen,
  Bed, Armchair, LayoutGrid, PencilRuler,
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const loc = locale as "ar" | "en";
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="space-y-16">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Scissors;
            const isEven = index % 2 === 0;

            return (
              <div
                key={service.id}
                className={`grid lg:grid-cols-2 gap-8 items-center ${!isEven ? "lg:direction-rtl" : ""}`}
              >
                <div className={`relative aspect-video rounded-2xl overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
                  <ProjectImage
                    src={service.image}
                    alt={service.title[loc]}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className={!isEven ? "lg:order-1" : ""}>
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{service.title[loc]}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description[loc]}</p>
                  <Link href="/contact">
                    <Button variant="outline" className="group">
                      {t("learnMore")}
                      <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
