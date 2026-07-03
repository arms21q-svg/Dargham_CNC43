import { SITE_CONFIG } from "@/lib/constants";
import { getSettings } from "@/lib/data/settings";
import { buildContactLinks } from "@/lib/contact";

interface LocalBusinessJsonLdProps {
  locale: string;
}

export async function LocalBusinessJsonLd({ locale }: LocalBusinessJsonLdProps) {
  const settings = await getSettings();
  const contactLinks = buildContactLinks(settings);
  const loc = locale as "ar" | "en";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_CONFIG.fullName[loc],
    description: SITE_CONFIG.fullName[loc],
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.address[loc],
      addressCountry: "IQ",
    },
    url: contactLinks.map,
    sameAs: [settings.social.instagram, settings.social.facebook],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
