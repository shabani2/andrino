import type { Metadata } from "next";
import { getCopy } from "@/i18n/copy-server";
import { getLocale } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

export async function createMetadata(title: string, description?: string, pathname?: string): Promise<Metadata> {
  const c = await getCopy();
  const locale = await getLocale() as Locale;
  return {
    title: c(title),
    ...(description ? { description: c(description) } : {}),
    openGraph: { type: "website", siteName: siteConfig.name, title: c(title), description: description ? c(description) : undefined, locale: locale === "fr" ? "fr_FR" : "en_GB" },
    ...(pathname ? { alternates: {
      canonical: getPathname({ locale, href: pathname }),
      languages: {
        en: getPathname({ locale: "en", href: pathname }),
        fr: getPathname({ locale: "fr", href: pathname }),
      },
    } } : {}),
  };
}
