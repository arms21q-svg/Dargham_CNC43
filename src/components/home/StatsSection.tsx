"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

const statKeys = ["projects", "clients", "years", "satisfaction"] as const;

export function StatsSection() {
  const t = useTranslations("stats");
  const locale = useLocale();
  const settings = useSiteSettings();
  const values = [
    settings.stats.projects,
    settings.stats.clients,
    settings.stats.years,
    settings.stats.satisfaction,
  ];
  const suffixes = ["+", "+", "", "%"];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="glass-strong rounded-3xl p-10 md:p-14 border border-white/15">
          <SectionHeading title={t("title")} className="[&_h2]:text-gradient-gold" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statKeys.map((key, index) => (
              <motion.div
                key={key}
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-2xl glass border border-white/10 hover:border-gold/30 transition-colors duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 shimmer-text">
                  <AnimatedCounter end={values[index]} suffix={suffixes[index]} locale={locale} />
                </div>
                <p className="text-muted-foreground text-sm md:text-base font-medium">{t(key)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
