"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "ar" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 glass rounded-xl p-1">
      {(["ar", "en"] as const).map((lang) => (
        <motion.button
          key={lang}
          whileTap={{ scale: 0.95 }}
          onClick={() => switchLocale(lang)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300",
            locale === lang
              ? "bg-gradient-to-r from-navy-700 to-navy-600 text-white shadow-md border border-white/10"
              : "text-muted-foreground hover:text-gold"
          )}
        >
          {lang === "ar" ? "عربي" : "EN"}
        </motion.button>
      ))}
    </div>
  );
}
