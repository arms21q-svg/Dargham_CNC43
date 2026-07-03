"use client";

import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Cog } from "lucide-react";
import { transition, staggerContainer, staggerItem } from "@/lib/animations";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { getAddressFromSettings } from "@/lib/contact";
import { useIsDesktop } from "@/hooks/usePageActive";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] md:h-[480px] lg:h-[520px] rounded-3xl bg-wood-cream animate-pulse flex items-center justify-center">
        <Cog className="w-10 h-10 text-navy-400/40 animate-spin" />
      </div>
    ),
  }
);

function HeroVisual() {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <div className="w-full h-[280px] sm:h-[320px] rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-navy-600 flex flex-col items-center justify-center gap-4 border border-navy-600/20 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center">
          <Cog className="w-10 h-10 text-gold animate-spin" style={{ animationDuration: "8s" }} />
        </div>
        <p className="font-label text-gold text-sm tracking-widest">CNC PRECISION</p>
      </div>
    );
  }

  return <HeroScene />;
}

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const settings = useSiteSettings();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const address = getAddressFromSettings(settings, isRtl ? "ar" : "en");

  return (
    <section className="relative min-h-0 lg:min-h-[88vh] flex items-center overflow-hidden">
      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="glass-strong rounded-3xl p-6 md:p-10 lg:p-12"
          >
            <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-navy flex items-center justify-center border border-gold/30">
                <span className="font-display text-gold text-xl">ض</span>
              </div>
              <div>
                <p className="font-label text-gold uppercase tracking-widest">Dirgham CNC</p>
                <p className="text-muted-foreground text-xs">{address}</p>
              </div>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="font-display text-3xl md:text-5xl lg:text-[3.25rem] leading-[1.1] mb-5"
            >
              <span className="text-gradient-brand">{t("title")}</span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-3">
              <Link href="/portfolio">
                <Button size="lg" className="group">
                  {t("ctaPortfolio")}
                  <Arrow className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">{t("ctaContact")}</Button>
              </Link>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/10"
            >
              {[
                { num: `${settings.stats.years}+`, label: isRtl ? "سنوات" : "Years" },
                { num: `${settings.stats.projects}+`, label: isRtl ? "مشروع" : "Projects" },
                { num: `${settings.stats.satisfaction}%`, label: isRtl ? "رضا" : "Happy" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-2.5 text-center bg-white/40 border border-white/20">
                  <p className="font-display text-xl text-gold">{stat.num}</p>
                  <p className="font-label text-muted-foreground text-[10px] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[1.75rem] overflow-hidden bg-wood-cream border border-navy-600/10 shadow-lg">
              <HeroVisual />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
