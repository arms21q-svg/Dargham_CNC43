"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Target, Zap, Award, TreePine, Pencil, DollarSign, Clock,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/animations";

const features = [
  { key: "precision", icon: Target },
  { key: "speed", icon: Zap },
  { key: "quality", icon: Award },
  { key: "materials", icon: TreePine },
  { key: "custom", icon: Pencil },
  { key: "pricing", icon: DollarSign },
  { key: "experience", icon: Clock },
] as const;

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                variants={staggerItem}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-center p-6 rounded-2xl glass-card glass-hover group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-4 border border-gold/20"
                >
                  <Icon className="w-8 h-8 text-gold" />
                </motion.div>
                <h3 className="font-bold text-foreground group-hover:text-gold transition-colors">
                  {t(feature.key)}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
