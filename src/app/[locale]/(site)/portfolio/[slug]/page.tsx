import { getCopy } from "@/i18n/copy-server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  ArrowLink,
  EditorialImage,
  Eyebrow,
} from "@/components/shared/editorial";
import { CallToAction } from "@/components/shared/call-to-action";
import { getPortfolioItems, getPortfolioItemBySlug } from "@/lib/portfolio";
import { createMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getPortfolioItems().map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props) {
  const item = getPortfolioItemBySlug((await params).slug);
  if (!item) notFound();
  return createMetadata(item.title, item.description, "/portfolio/" + item.slug);
}
export default async function CaseStudyPage({ params }: Props) {
  const c = await getCopy();

  const item = getPortfolioItemBySlug((await params).slug);
  if (!item) notFound();
  return (
    <section className="detail-page">
      <Container>
        <ArrowLink href="/portfolio" className="detail-back">
          {c("Back to portfolio")}</ArrowLink>
        <header className="detail-header">
          <Eyebrow>{c(item.category)} {c("/ Practice area")}</Eyebrow>
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
            <h2>{c("Communication with context.")}</h2>
            <div className="prose">
              <p>
                {c("Each project represents an opportunity to communicate an idea, document an experience or help an audience understand an issue more clearly.")}</p>
              <p>{c(item.description)}</p>
            </div>
            <h2>{c("What this portfolio will document.")}</h2>
            <div className="prose">
              <p>
                {c("Each entry will include the project context, objective, my role, selected outputs, collaborators where relevant, verified results where available, and a link to the published work.")}</p>
            </div>
            <p className="page-note">
              {c("This page introduces an area of practice. Approved case studies and publicly shareable outputs will be added progressively.")}</p>
          </div>
          <aside className="detail-sidebar">
            <Eyebrow>{c("In focus")}</Eyebrow>
            <h2>{c(item.category)}</h2>
            <div className="tag-list mb-6">
              {item.tags.map((tag) => (
                <span key={tag} className="tag">
                  {c(tag)}
                </span>
              ))}
            </div>
            <p>
              {c("Interested in an editorial project, communication challenge or creative collaboration?")}</p>
            <ArrowLink href="/contact">{c("Start a conversation")}</ArrowLink>
          </aside>
        </div>
        <div className="detail-related">
          <CallToAction
            title={c("An idea worth exploring together?")}
            href="/contact"
            label={c("Get in touch")}
          />
        </div>
      </Container>
    </section>
  );
}
