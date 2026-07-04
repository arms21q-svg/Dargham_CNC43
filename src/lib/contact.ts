import type { SiteSettings } from "@/types";

function hasValue(value?: string) {
  return Boolean(value?.trim());
}

export function buildContactLinks(settings: Pick<SiteSettings, "phone" | "whatsapp" | "mapUrl" | "email">) {
  return {
    phone: hasValue(settings.phone) ? `tel:${settings.phone}` : null,
    whatsapp: hasValue(settings.whatsapp)
      ? `https://wa.me/${settings.whatsapp.replace(/\+/g, "")}`
      : null,
    map: hasValue(settings.mapUrl) ? settings.mapUrl : null,
    email: hasValue(settings.email) ? `mailto:${settings.email}` : null,
  };
}

export function getAddressFromSettings(settings: SiteSettings, locale: "ar" | "en") {
  return settings.address[locale]?.trim() || settings.address.ar?.trim() || settings.address.en?.trim() || "";
}
