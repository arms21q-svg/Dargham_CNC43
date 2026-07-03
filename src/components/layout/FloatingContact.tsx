"use client";

import { useLocale } from "next-intl";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildContactLinks } from "@/lib/contact";

export function FloatingContact() {
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const settings = useSiteSettings();
  const contactLinks = buildContactLinks(settings);

  const items = [
    { key: "map", icon: MapPin, href: contactLinks.map, external: true, labelAr: "الموقع", labelEn: "Location" },
    { key: "call", icon: Phone, href: contactLinks.phone, external: false, labelAr: "اتصال", labelEn: "Call" },
    { key: "wa", icon: MessageCircle, href: contactLinks.whatsapp, external: true, labelAr: "واتساب", labelEn: "WhatsApp" },
  ] as const;

  return (
    <div
      className={`fixed bottom-6 z-50 flex flex-col gap-3 ${isRtl ? "left-5" : "right-5"}`}
      aria-label="Quick contact"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const label = locale === "ar" ? item.labelAr : item.labelEn;
        return (
          <motion.a
            key={item.key}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2"
            title={label}
          >
            <span className="glass-strong px-3 py-1.5 rounded-xl text-xs font-label text-gold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block shadow-lg">
              {item.key === "call" ? settings.phoneDisplay : label}
            </span>
            <span
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 ${
                item.key === "wa"
                  ? "bg-gradient-to-br from-green-600 to-green-500 text-white"
                  : item.key === "map"
                    ? "gradient-navy text-gold"
                    : "bg-gradient-to-br from-gold to-gold-light text-navy-900"
              }`}
            >
              <Icon className="w-5 h-5" />
            </span>
          </motion.a>
        );
      })}
    </div>
  );
}
