"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "/" },
  { key: "portfolio", href: "/portfolio" },
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "glass-nav shadow-lg shadow-navy-900/20" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className={cn("flex items-center justify-between transition-all duration-300", scrolled ? "h-16" : "h-18 md:h-20")}>
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-xl gradient-navy flex items-center justify-center shadow-lg border border-white/20"
            >
              <span className="text-gold font-bold text-lg">ض</span>
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-display text-lg text-foreground group-hover:text-gold transition-colors duration-300">
                ضرغام
              </span>
              <span className="block font-label text-muted-foreground text-[0.65rem] tracking-widest uppercase">
                CNC Woodworks
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 glass rounded-2xl px-2 py-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.key} href={item.href} className="relative px-4 py-2 group rounded-xl">
                  <span
                    className={cn(
                      "font-label text-sm transition-colors duration-300",
                      isActive ? "text-gold" : "text-foreground/80 group-hover:text-gold"
                    )}
                  >
                    {t(item.key)}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 glass-strong rounded-xl -z-10 border-gold/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-foreground hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t border-white/10 overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                      pathname === item.href
                        ? "text-gold glass-strong"
                        : "text-foreground/80 hover:glass hover:text-gold"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
