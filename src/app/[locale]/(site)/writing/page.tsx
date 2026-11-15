import { getCopy } from "@/i18n/copy-server";
import { Suspense } from "react";
import { Rss, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { ArrowLink, Eyebrow } from "@/components/shared/editorial";
import { FeaturedArticle } from "@/components/writing/featured-article";
import { WritingExplorer } from "@/components/writing/writing-explorer";
import { identity } from "@/config/identity";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getArticles } from "@/lib/articles";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Posts",
  "Andrino’s posts on Goma, African media and the Great Lakes region.",
  "/writing",
); }
export default async function WritingPage() {
  const c = await getCopy();
  const t = await getTranslations("contactChannels");
  const articles = await getArticles(await getLocale() as Locale);
  const hasPublishedArticle = articles.some((article) => article.status === "published");

  return (
    <>
      <PageHero
        label={c("Posts from Goma")}
        title={c("Posts and opinions.")}
        description={c("From Goma, I write about Africa, the media and the people around me.")}
      />
      <section className="pb-20">
        <Container>
          <div className="writing-intro-note mb-8">
            <span>{c("From Goma and the Great Lakes")}</span>
            <span>{hasPublishedArticle ? c("Posts available") : c("Topics in preparation")}</span>
          </div>
          {!hasPublishedArticle && <FeaturedArticle />}
          <Suspense fallback={<p role="status">{c("Loading posts…")}</p>}>
            <WritingExplorer articles={articles} />
          </Suspense>
          <div className="editorial-bottom-grid">
            <section className="editorial-standards">
              <Eyebrow>
                <ShieldCheck
                  size={15}
                  className="inline mr-2"
                  aria-hidden="true"
                />
                {c("How I write")}</Eyebrow>
              <h2>{c("About my opinions.")}</h2>
              <p>
                {c("I separate opinion from verified facts. I cite sources and correct mistakes when I find them.")}</p>
              <ArrowLink href="/about">{c("Read my guiding principles")}</ArrowLink>
            </section>
            <section className="dispatch-panel">
              <Eyebrow>
                <Rss size={15} className="inline mr-2" aria-hidden="true" />
                {c("On this site and elsewhere")}</Eyebrow>
              <h2>
                {c("Posts and")}{" "}<br />{c("videos.")}</h2>
              <p>
                {c("I publish reporting, essays and opinion posts. I also share videos on YouTube.")}</p>
              <ArrowLink href={identity.youtube} external>
                {t("youtube")}</ArrowLink>
              <ArrowLink href="/links">{c("Across the web")}</ArrowLink>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
