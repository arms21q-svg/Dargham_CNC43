import type { SiteSettings } from "@/types";

export function buildContactLinks(settings: Pick<SiteSettings, "phone" | "whatsapp" | "mapUrl" | "email">) {
  return {
    phone: `tel:${settings.phone}`,
    whatsapp: `https://wa.me/${settings.whatsapp.replace(/\+/g, "")}`,
    map: settings.mapUrl,
    email: `mailto:${settings.email}`,
  };
}

export function getAddressFromSettings(settings: SiteSettings, locale: "ar" | "en") {
  return settings.address[locale];
}
