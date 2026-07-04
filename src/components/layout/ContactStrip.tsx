"use client";

import { useLocale, useTranslations } from "next-intl";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildContactLinks, getAddressFromSettings } from "@/lib/contact";

export function ContactStrip() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("contact.info");
  const settings = useSiteSettings();
  const contactLinks = buildContactLinks(settings);
  const address = getAddressFromSettings(settings, locale);

  const links = [
    settings.phoneDisplay?.trim() && contactLinks.phone
      ? { icon: Phone, label: t("phone"), value: settings.phoneDisplay, href: contactLinks.phone }
      : null,
    settings.whatsappDisplay?.trim() && contactLinks.whatsapp
      ? { icon: MessageCircle, label: t("whatsapp"), value: settings.whatsappDisplay, href: contactLinks.whatsapp, external: true }
      : null,
    address && contactLinks.map
      ? { icon: MapPin, label: t("address"), value: address, href: contactLinks.map, external: true }
      : null,
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[];

  if (links.length === 0) return null;

  return (
    <div className="glass-nav border-b border-white/10 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 h-10 text-xs">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-label"
            >
              <link.icon className="w-3.5 h-3.5 text-gold" />
              <span>{link.value}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
