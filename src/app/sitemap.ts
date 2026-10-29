import type { MetadataRoute } from "next";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/articles";
import { getPortfolioItems } from "@/lib/portfolio";
import { getProjects } from "@/lib/projects";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...navigation.map((item) => item.href),
    ...getArticles().map((item) => `/writing/${item.slug}`),
    ...getPortfolioItems().map((item) => `/portfolio/${item.slug}`),
    ...getProjects().map((item) => `/projects/${item.slug}`),
  ];
  return routing.locales.flatMap((locale) => paths.map((pathname) => ({
    url: new URL(getPathname({ locale, href: pathname }), siteConfig.url).href,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((language) => [
        language,
        new URL(getPathname({ locale: language, href: pathname }), siteConfig.url).href,
      ])),
    },
  })));
}
