import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms" });

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title={t("title")} centered />
        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>باستخدامك لموقع ضرغام لأعمال CNC الخشب، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>
          <h3 className="text-foreground font-bold text-lg">الخدمات</h3>
          <p>نقدم خدمات تصميم وتنفيذ أعمال CNC الخشب وفقاً للمواصفات المتفق عليها مع العميل.</p>
          <h3 className="text-foreground font-bold text-lg">الأسعار والدفع</h3>
          <p>يتم الاتفاق على الأسعار قبل بدء المشروع. نطلب دفعة مقدمة بنسبة 50% عند التعاقد.</p>
          <h3 className="text-foreground font-bold text-lg">الضمان</h3>
          <p>نقدم ضماناً لمدة سنة على جميع أعمالنا ضد عيوب التصنيع.</p>
        </div>
      </div>
    </div>
  );
}
