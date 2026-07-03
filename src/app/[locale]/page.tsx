import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { getSliderProjects } from "@/lib/data/projects";
import { getSettings } from "@/lib/data/settings";

const ServicesSection = dynamic(() =>
  import("@/components/home/ServicesSection").then((m) => m.ServicesSection)
);
const WhyUsSection = dynamic(() =>
  import("@/components/home/WhyUsSection").then((m) => m.WhyUsSection)
);
const StatsSection = dynamic(() =>
  import("@/components/home/StatsSection").then((m) => m.StatsSection)
);
const ProjectSlider = dynamic(() =>
  import("@/components/home/ProjectSlider").then((m) => m.ProjectSlider)
);
const TestimonialsSection = dynamic(() =>
  import("@/components/home/TestimonialsSection").then((m) => m.TestimonialsSection)
);
const CTASection = dynamic(() =>
  import("@/components/home/CTASection").then((m) => m.CTASection)
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSettings();
  const sliderProjects = await getSliderProjects(settings.sliderProjectIds);

  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyUsSection />
      <StatsSection />
      <ProjectSlider projects={sliderProjects} />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
