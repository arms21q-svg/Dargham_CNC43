"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import {
  Scissors, PenTool, Sparkles, ChefHat, DoorOpen,
  Bed, Armchair, LayoutGrid, PencilRuler,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { services } from "@/data";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scissors, PenTool, Sparkles, ChefHat, DoorOpen,
  Bed, Armchair, LayoutGrid, PencilRuler,
};

const serviceKeys = [
  "cncCutting", "cncEngraving", "woodDecor", "kitchens", "doors",
  "bedrooms", "furniture", "woodPanels", "customDesign",
] as const;

export function ServicesSection() {
  const t = useTranslations("services");
  const locale = useLocale() as "ar" | "en";

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Scissors;
            const key = serviceKeys[index];
            return (
              <motion.div key={service.id} variants={staggerItem}>
                <Card hover className="h-full group cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4 border border-gold/20"
                  >
                    <Icon className="w-7 h-7 text-gold" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gold transition-colors duration-300">
                    {key ? t(key) : service.title[locale]}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description[locale]}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          className="text-center mt-12"
        >
          <Link href="/services">
            <Button variant="secondary">{t("viewAll")}</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
