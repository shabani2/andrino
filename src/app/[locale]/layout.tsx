import type { ReactNode } from "react";
import localFont from "next/font/local";
import { defaultMetadata } from "@/config/seo";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getCopy } from "@/i18n/copy-server";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { notFound } from "next/navigation";
import "../globals.css";

const newsreader = localFont({
  src: [
    {
      path: "../../../public/fonts/newsreader-latin.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/newsreader-italic-latin.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  variable: "--font-newsreader",
  display: "swap",
});
const dmSans = localFont({
  src: "../../../public/fonts/dm-sans-latin.woff2",
  weight: "400 700",
  variable: "--font-dm-sans",
  display: "swap",
});
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  const c = await getCopy();
  return { ...defaultMetadata, description: c(defaultMetadata.description || "") };
}

export default async function RootLayout({ children, params }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const c = await getCopy();
  return (
    <html lang={locale} className={newsreader.variable + " " + dmSans.variable} suppressHydrationWarning>
      <body id="top">
        <NextIntlClientProvider>
          <ThemeProvider>
            <a href="#main-content" className="skip-link">
              {c("Skip to content")}
            </a>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
