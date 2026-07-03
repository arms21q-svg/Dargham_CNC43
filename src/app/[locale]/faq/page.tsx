import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { faqs } from "@/data";

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faq" });
  const loc = locale as "ar" | "en";

  const items = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question[loc],
    answer: faq.answer[loc],
  }));

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
        <Accordion items={items} />
      </div>
    </div>
  );
}
