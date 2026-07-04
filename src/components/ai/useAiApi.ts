"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function useAiApi() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("ai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(
    async <T,>(action: string, body: Record<string, unknown>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ai/${action}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...body, locale }),
        });
        const data = await res.json();
        if (!res.ok || data.unavailable) {
          setError(data.error || t("unavailable"));
          return null;
        }
        return data as T;
      } catch {
        setError(t("unavailable"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [locale, t]
  );

  return { call, loading, error, locale, clearError: () => setError(null) };
}
