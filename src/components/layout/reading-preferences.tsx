"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Check, ChevronDown, Globe, LoaderCircle, Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenu, RadioGroup } from "radix-ui";
import { useSyncExternalStore, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const subscribe = () => () => {};
const languages = [
  { value: "fr", code: "FR", label: "french" },
  { value: "en", code: "EN", label: "english" },
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
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [pending, startTransition] = useTransition();

  function changeLocale(next: Locale) {
    if (next === locale) return;
    // Read on interaction so query filters and anchors survive language changes.
    const destination = pathname + window.location.search + window.location.hash;
    startTransition(() => router.replace(destination, { locale: next, scroll: false }));
  }

  return (
    <div
      className={"reading-preferences" + (compact ? " preferences-compact" : "")}
      role="group"
      aria-label={t("options")}
      aria-busy={pending}
    >
      {compact ? (
        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="language-trigger"
              aria-label={`${t("language")} : ${t(locale === "fr" ? "french" : "english")}`}
              disabled={pending}
            >
              {pending ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Globe size={15} aria-hidden="true" />}
              <span>{locale.toUpperCase()}</span>
              <ChevronDown size={12} className="language-chevron" aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="language-menu" align="end" sideOffset={10} collisionPadding={16}>
              <DropdownMenu.Label className="language-menu-label">{t("language")}</DropdownMenu.Label>
              <DropdownMenu.RadioGroup value={locale} onValueChange={(value) => changeLocale(value as Locale)}>
                {languages.map((language) => (
                  <DropdownMenu.RadioItem className="language-menu-item" key={language.value} value={language.value} disabled={pending}>
                    <span className="language-code" aria-hidden="true">{language.code}</span>
                    <span lang={language.value}>{t(language.label)}</span>
                    <DropdownMenu.ItemIndicator className="language-check"><Check size={16} aria-hidden="true" /></DropdownMenu.ItemIndicator>
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      ) : (
        <div className="preference-row">
          <span className="preference-label">{t("language")}</span>
          <RadioGroup.Root className="segmented-control language-segments" value={locale} onValueChange={(value) => changeLocale(value as Locale)} orientation="horizontal" aria-label={t("language")} disabled={pending}>
            {languages.map((language) => (
              <RadioGroup.Item className="segment-option" key={language.value} value={language.value} aria-label={t(language.label)}>
                <span className="locale-short" aria-hidden="true">{language.code}</span>
                <span lang={language.value}>{t(language.label)}</span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </div>
      )}
      <div className="preference-row theme-preference">
        {!compact && <span className="preference-label">{t("appearance")}</span>}
        <RadioGroup.Root className="segmented-control theme-segments" value={mounted ? theme : "system"} onValueChange={setTheme} orientation="horizontal" aria-label={t("appearance")}>
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
