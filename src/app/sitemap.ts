import type { MetadataRoute } from "next";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/articles";
import { getPortfolioItems } from "@/lib/portfolio";
import { getProjects } from "@/lib/projects";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pathsByLocale = await Promise.all(routing.locales.map(async (locale) => ({
    locale,
    paths: [
      ...navigation.map((item) => item.href),
      ...(await getArticles(locale)).map((item) => `/writing/${item.slug}`),
      ...(await getPortfolioItems(locale)).map((item) => `/portfolio/${item.slug}`),
      ...(await getProjects(locale)).map((item) => `/projects/${item.slug}`),
    ],
  })));
  return pathsByLocale.flatMap(({ locale, paths }) => paths.map((pathname) => ({
    url: new URL(getPathname({ locale, href: pathname }), siteConfig.url).href,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((language) => [
        language,
        new URL(getPathname({ locale: language, href: pathname }), siteConfig.url).href,
      ])),
    },
  })));
}
