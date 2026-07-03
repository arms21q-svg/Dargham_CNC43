import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-2">{t("notFound")}</h2>
      <p className="text-muted-foreground mb-8">{t("notFoundDesc")}</p>
      <Link href="/">
        <Button>{t("back")}</Button>
      </Link>
    </div>
  );
}
