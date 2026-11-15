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
import { CallToAction } from "@/components/shared/call-to-action";
import { getPortfolioItemBySlug } from "@/lib/portfolio";
import { createMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const item = await getPortfolioItemBySlug(await getLocale() as Locale, (await params).slug);
  if (!item) notFound();
  return createMetadata(item.title, item.description, "/portfolio/" + item.slug);
}
export default async function CaseStudyPage({ params }: Props) {
  const c = await getCopy();

  const item = await getPortfolioItemBySlug(await getLocale() as Locale, (await params).slug);
  if (!item) notFound();
  return (
    <section className="detail-page">
      <Container>
        <ArrowLink href="/portfolio" className="detail-back">
          {c("Back to portfolio")}</ArrowLink>
        <header className="detail-header">
          <Eyebrow>{c(item.category)}</Eyebrow>
          <h1>{c(item.title)}</h1>
          <p>{c(item.description)}</p>
        </header>
        <EditorialImage
          src={item.image}
          alt={c(item.alt)}
          priority
          className="detail-image"
          sizes="100vw"
        />
        <div className="detail-content">
          <div>
            <h2>{c("What I do in this area.")}</h2>
            <div className="prose">
              <p>
                {c("I start with the people the work is for and what it needs to explain.")}</p>
            </div>
            <h2>{c("What you will find here.")}</h2>
            <div className="prose">
              <p>
                {c("I will add work I can share, with my role and the people involved.")}</p>
            </div>
          </div>
          <aside className="detail-sidebar">
            <Eyebrow>{c("This area")}</Eyebrow>
            <h2>{c(item.category)}</h2>
            <div className="tag-list mb-6">
              {item.tags.map((tag) => (
                <span key={tag} className="tag">
                  {c(tag)}
                </span>
              ))}
            </div>
            <p>
              {c("Have a project in this area?")}</p>
            <ArrowLink href="/contact">{c("Write to me about it")}</ArrowLink>
          </aside>
        </div>
        <div className="detail-related">
          <CallToAction
            title={c("A project to discuss?")}
            href="/contact"
            label={c("Get in touch")}
          />
        </div>
      </Container>
    </section>
  );
}
