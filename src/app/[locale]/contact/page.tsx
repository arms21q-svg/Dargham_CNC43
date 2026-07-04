"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { buildContactLinks, getAddressFromSettings } from "@/lib/contact";
import { contactFormSchema, sanitizeInput } from "@/lib/validation";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale() as "ar" | "en";
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const settings = useSiteSettings();
  const contactLinks = buildContactLinks(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const sanitized = {
      name: sanitizeInput(form.name),
      email: sanitizeInput(form.email),
      phone: sanitizeInput(form.phone),
      subject: sanitizeInput(form.subject),
      message: sanitizeInput(form.message),
    };

    const result = contactFormSchema.safeParse(sanitized);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitized),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const contactInfo = [
    settings.phoneDisplay?.trim() && contactLinks.phone
      ? { icon: Phone, label: t("info.phone"), value: settings.phoneDisplay, href: contactLinks.phone }
      : null,
    settings.email?.trim() && contactLinks.email
      ? { icon: Mail, label: t("info.email"), value: settings.email, href: contactLinks.email }
      : null,
    settings.whatsappDisplay?.trim() && contactLinks.whatsapp
      ? { icon: MessageCircle, label: t("info.whatsapp"), value: settings.whatsappDisplay, href: contactLinks.whatsapp }
      : null,
    getAddressFromSettings(settings, locale) && contactLinks.map
      ? { icon: MapPin, label: t("info.address"), value: getAddressFromSettings(settings, locale), href: contactLinks.map }
      : null,
    { icon: Clock, label: t("info.hours"), value: t("info.hoursValue") },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              id="name"
              label={t("form.name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              id="email"
              type="email"
              label={t("form.email")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              id="phone"
              label={t("form.phone")}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={errors.phone}
            />
            <Input
              id="subject"
              label={t("form.subject")}
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              error={errors.subject}
            />
            <Textarea
              id="message"
              label={t("form.message")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              error={errors.message}
            />
            <Button type="submit" size="lg" disabled={status === "sending"} className="w-full">
              {status === "sending" ? t("form.sending") : t("form.submit")}
            </Button>
            {status === "success" && (
              <p className="text-green-600 text-center font-medium">{t("form.success")}</p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-center font-medium">{t("form.error")}</p>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start gap-4 p-4 rounded-xl glass-card">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <info.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="font-medium text-foreground hover:text-gold transition-colors" target={info.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-medium text-foreground">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            {contactLinks.map && (
            <a
              href={contactLinks.map}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl overflow-hidden glass-card h-64 group hover:border-gold/40 transition-colors"
            >
              <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <p className="font-heading text-foreground mb-1">{getAddressFromSettings(settings, locale)}</p>
                  <p className="font-label text-gold text-sm group-hover:underline">{t("info.openMap")}</p>
                </div>
              </div>
            </a>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
