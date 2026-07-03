import { Tajawal, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/data/settings";
import { Providers } from "@/components/providers/Providers";
import { SiteBackground } from "@/components/layout/SiteBackground";
import { ContactStrip } from "@/components/layout/ContactStrip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import "../globals.css";

/** خط عربي – Tajawal: أنيق وواضح للعناوين والنصوص */
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

/** خط إنجليزي – Plus Jakarta Sans: عصري واحترافي */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const siteSettings = await getSettings();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isAr = locale === "ar";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${tajawal.variable} ${jakarta.variable} h-full`}
    >
      <body
        className={`min-h-full flex flex-col antialiased ${isAr ? "font-ar" : "font-en"}`}
      >
        <LocalBusinessJsonLd locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <Providers siteSettings={siteSettings}>
            <SiteBackground />
            <ContactStrip />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingContact />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
