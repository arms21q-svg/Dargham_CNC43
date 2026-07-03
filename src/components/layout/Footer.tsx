"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, MessageCircle, Share2, Globe } from "lucide-react";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildContactLinks, getAddressFromSettings } from "@/lib/contact";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tContact = useTranslations("contact.info");
  const locale = useLocale() as "ar" | "en";
  const settings = useSiteSettings();
  const contactLinks = buildContactLinks(settings);
  const address = getAddressFromSettings(settings, locale);

  const quickLinks = [
    { key: "home", href: "/" },
    { key: "portfolio", href: "/portfolio" },
    { key: "services", href: "/services" },
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <footer className="relative mt-8">
      <div className="glass-nav border-t border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-navy flex items-center justify-center border border-white/20">
                  <span className="text-gold font-bold text-lg">ض</span>
                </div>
                <span className="font-bold text-xl text-foreground">ضرغام</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t("description")}</p>
              <div className="flex gap-3">
                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-gold transition-colors" aria-label="Instagram">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:text-gold transition-colors" aria-label="Facebook">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gold">{t("quickLinks")}</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.key}>
                    <Link href={link.href} className="text-muted-foreground hover:text-gold transition-colors text-sm">
                      {tNav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gold">{t("contact")}</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <a href={contactLinks.phone} className="hover:text-gold transition-colors">
                    {settings.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground text-sm">
                  <MessageCircle className="w-4 h-4 text-gold shrink-0" />
                  <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    {settings.whatsappDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <a href={contactLinks.email} className="hover:text-gold transition-colors">{settings.email}</a>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <a href={contactLinks.map} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                    {address}
                  </a>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gold">{tContact("address")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {address}
              </p>
              <a
                href={contactLinks.map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-label text-gold hover:underline"
              >
                <MapPin className="w-4 h-4" />
                {tContact("openMap")}
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Dirgham CNC · {settings.phoneDisplay} · {t("rights")}
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-gold text-sm transition-colors">{t("privacy")}</Link>
              <Link href="/terms" className="text-muted-foreground hover:text-gold text-sm transition-colors">{t("terms")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
