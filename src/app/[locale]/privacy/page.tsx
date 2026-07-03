import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title={t("title")} centered />
        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>نحن في ضرغام لأعمال CNC الخشب نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية.</p>
          <h3 className="text-foreground font-bold text-lg">جمع المعلومات</h3>
          <p>نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التواصل معنا عبر نموذج الاتصال أو البريد الإلكتروني.</p>
          <h3 className="text-foreground font-bold text-lg">استخدام المعلومات</h3>
          <p>نستخدم معلوماتك للرد على استفساراتك وتقديم خدماتنا وتحسين تجربتك معنا.</p>
          <h3 className="text-foreground font-bold text-lg">حماية المعلومات</h3>
          <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به.</p>
        </div>
      </div>
    </div>
  );
}
