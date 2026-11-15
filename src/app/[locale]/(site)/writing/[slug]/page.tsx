import { getCopy } from "@/i18n/copy-server";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  ArrowLink,
  EditorialImage,
  Eyebrow,
} from "@/components/shared/editorial";
import { ArticleHeader } from "@/components/writing/article-header";
import { ArticleShare } from "@/components/writing/article-share";
import { PublishedBody } from "@/components/writing/published-body";
import { MediaEmbed } from "@/components/shared/media-embed";
import { PostEngagement } from "@/components/shared/post-engagement";
import { getEngagement } from "@/lib/engagement";
import { siteConfig } from "@/config/site";
import { ArticleGrid } from "@/components/writing/article-grid";
import { getArticles, getArticleBySlug } from "@/lib/articles";
import { createMetadata } from "@/lib/seo";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const article = await getArticleBySlug(await getLocale() as Locale, (await params).slug);
  if (!article) notFound();
  const metadata = await createMetadata(article.title, article.excerpt, "/writing/" + article.slug);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", images: [article.coverImage] } };
}
export default async function ArticlePage({ params }: Props) {
  const c = await getCopy();
  const locale = await getLocale() as Locale;
  const article = await getArticleBySlug(locale, (await params).slug);
  const related = (await getArticles(locale)).filter((item) => item.slug !== article?.slug).slice(0, 3);
  if (!article) notFound();
  const engagement = article.id ? await getEngagement(article.id) : null;
  return (
    <article className="detail-page">
      {article.id && <PageViewTracker entryId={article.id} />}
      <Container>
        <ArrowLink href="/writing" className="detail-back">
          {c("Back to posts")}</ArrowLink>
        <ArticleHeader article={article} />
        <EditorialImage
          src={article.coverImage}
          alt={c(article.alt)}
          className="detail-image"
          priority
          sizes="100vw"
        />
        <div className="detail-content">
          <div>
            {article.status === "published" ? (
              <PublishedBody body={article.body} />
            ) : (
              <>
                <h2>{c("A topic I am working on.")}</h2>
                <div className="prose">
                  <p>{c(article.body)}</p>
                  <p>{c("I publish reporting, essays and opinion posts. I also share videos on YouTube.")}</p>
                  <p>{c("I use reporting and personal essays to understand the subjects I write about.")}</p>
                </div>
                <p className="page-note">{c("This topic is still in preparation. I will add articles when they are ready.")}</p>
              </>
            )}
            <MediaEmbed url={article.mediaUrl} locale={locale} />
            <ArticleShare title={article.title} locale={locale}
              url={new URL(`/${locale}/writing/${article.slug}`, siteConfig.url).toString()} />
            {article.id && engagement && <PostEngagement entryId={article.id} locale={locale} {...engagement} />}
          </div>
          <aside className="detail-sidebar">
            <Eyebrow>{c("From Goma")}</Eyebrow>
            <h2>{c("About my opinions.")}</h2>
            <p>
              {c("These opinions are mine. I separate them from verified facts and correct errors.")}</p>
            <ArrowLink href="/about">{c("About the writer")}</ArrowLink>
          </aside>
        </div>
        <section className="detail-related">
          <h2>{c("More posts.")}</h2>
          <ArticleGrid
            articles={related}
          />
        </section>
      </Container>
    </article>
  );
}
