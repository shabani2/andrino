import { getCopy } from "@/i18n/copy-server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  ArrowLink,
  EditorialImage,
  Eyebrow,
} from "@/components/shared/editorial";
import { ArticleHeader } from "@/components/writing/article-header";
import { ArticleShare } from "@/components/writing/article-share";
import { ArticleGrid } from "@/components/writing/article-grid";
import { getArticles, getArticleBySlug } from "@/lib/articles";
import { createMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getArticles().map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props) {
  const article = getArticleBySlug((await params).slug);
  if (!article) notFound();
  return createMetadata(article.title, article.excerpt, "/writing/" + article.slug);
}
export default async function ArticlePage({ params }: Props) {
  const c = await getCopy();

  const article = getArticleBySlug((await params).slug);
  if (!article) notFound();
  return (
    <article className="detail-page">
      <Container>
        <ArrowLink href="/writing" className="detail-back">
          {c("Back to the journal")}</ArrowLink>
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
            <h2>{c("A subject I want to explore.")}</h2>
            <div className="prose">
              <p>{c(article.body)}</p>
              <p>
                {c("Some articles will be based on reporting and conversations with people. Others will be personal essays or commentary on issues that interest me.")}</p>
              <p>
                {c("The purpose is not to have an opinion on everything. It is to explore the subjects I care about with curiosity, context and a willingness to think critically.")}</p>
            </div>
            <p className="page-note">
              {c("This is an introduction to a future editorial theme. Reported stories and essays will be published here as they become available.")}</p>
            <ArticleShare />
          </div>
          <aside className="detail-sidebar">
            <Eyebrow>{c("From Goma")}</Eyebrow>
            <h2>{c("A note on opinions.")}</h2>
            <p>
              {c("The opinions expressed in my personal writing are my own. I aim to distinguish personal perspectives from verified facts, give context to the issues I discuss and remain open to new information and different points of view.")}</p>
            <ArrowLink href="/about">{c("About the writer")}</ArrowLink>
          </aside>
        </div>
        <section className="detail-related">
          <h2>{c("Other perspectives.")}</h2>
          <ArticleGrid
            articles={getArticles()
              .filter((item) => item.slug !== article.slug)
              .slice(0, 3)}
          />
        </section>
      </Container>
    </article>
  );
}
