"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { RadioGroup } from "radix-ui";
import { useEffect, useOptimistic, useSyncExternalStore, useTransition } from "react";
import { useRouter as useNextRouter } from "next/navigation";
import { getPathname, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const subscribe = () => () => {};
const languages = [
  { value: "en", code: "ENG", label: "english" },
  { value: "fr", code: "FR", label: "french" },
] as const;
const themes = [
  { value: "light", label: "light", Icon: Sun },
  { value: "dark", label: "dark", Icon: Moon },
  { value: "system", label: "system", Icon: Monitor },
] as const;

export function ReadingPreferences({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("preferences");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [pending, startTransition] = useTransition();
  const [selectedLocale, selectLocale] = useOptimistic(locale);

  useEffect(() => {
    const next = locale === "en" ? "fr" : "en";
    nextRouter.prefetch(getPathname({
      href: pathname + window.location.search,
      locale: next,
    }));
  }, [locale, pathname, nextRouter]);

  function changeLocale(next: Locale) {
    if (next === locale) return;
    // Read on interaction so query filters and anchors survive language changes.
    const destination = pathname + window.location.search + window.location.hash;
    startTransition(() => {
      selectLocale(next);
      router.replace(destination, { locale: next, scroll: false });
    });
  }

  return (
    <div
      className={"reading-preferences" + (compact ? " preferences-compact" : "")}
      role="group"
      aria-label={t("options")}
      aria-busy={pending}
    >
      <div className="preference-row language-preference">
        {!compact && <span className="preference-label">{t("language")}</span>}
        <RadioGroup.Root
          className={`segmented-control language-segments${compact ? " language-segments-compact" : ""}`}
          value={selectedLocale}
          onValueChange={(value) => changeLocale(value as Locale)}
          orientation="horizontal"
          aria-label={t("language")}
          disabled={pending}
        >
          {languages.map((language) => (
            <RadioGroup.Item className="segment-option" key={language.value} value={language.value} aria-label={t(language.label)}>
              <span lang={language.value}>{language.code}</span>
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
      <div className="preference-row theme-preference">
        {!compact && <span className="preference-label">{t("appearance")}</span>}
        <RadioGroup.Root className="segmented-control theme-segments" value={mounted ? theme : "dark"} onValueChange={setTheme} orientation="horizontal" aria-label={t("appearance")}>
          {themes.map(({ value, label, Icon }) => (
            <RadioGroup.Item className="segment-option" key={value} value={value} aria-label={t(label)} title={t(label)}>
              <Icon size={16} strokeWidth={1.7} aria-hidden="true" />
              {!compact && <span>{value === "system" ? t("automatic") : t(label)}</span>}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
      <span className="sr-only" role="status">{pending ? t("switching") : ""}</span>
    </div>
  );
}
