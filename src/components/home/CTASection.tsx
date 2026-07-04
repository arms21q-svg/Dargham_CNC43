"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildContactLinks } from "@/lib/contact";

export function CTASection() {
  const t = useTranslations("cta");
  const settings = useSiteSettings();
  const contactLinks = buildContactLinks(settings);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden glass-strong border border-white/15"
        >
          <div className="absolute inset-0 gradient-navy opacity-80" />
          <div className="absolute top-0 right-0 w-60 h-60 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-navy-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 p-12 md:p-20 text-center">
            <span className="inline-block text-4xl mb-4">🇮🇶</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gradient-gold mb-4">{t("title")}</h2>
            <p className="text-foreground/70 text-lg mb-10 max-w-xl mx-auto">{t("subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {contactLinks.whatsapp && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={contactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t("whatsapp")}
                </Button>
              </motion.a>
              )}
              {contactLinks.phone && (
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={contactLinks.phone}>
                <Button variant="outline" size="lg" className="gap-2">
                  <Phone className="w-5 h-5" />
                  {t("call")}
                </Button>
              </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
