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
import { getProjectBySlug } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";
import { MediaEmbed } from "@/components/shared/media-embed";
import { ArticleShare } from "@/components/writing/article-share";
import { PostEngagement } from "@/components/shared/post-engagement";
import { getEngagement } from "@/lib/engagement";
import { siteConfig } from "@/config/site";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const project = await getProjectBySlug(await getLocale() as Locale, (await params).slug);
  if (!project) notFound();
  const metadata = await createMetadata(project.title, project.description, "/projects/" + project.slug);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [project.image] } };
}
export default async function ProjectPage({ params }: Props) {
  const c = await getCopy();
  const locale = await getLocale() as Locale;

  const project = await getProjectBySlug(locale, (await params).slug);
  if (!project) notFound();
  const engagement = project.id ? await getEngagement(project.id) : null;
  return (
    <article className="detail-page">
      <Container>
        <ArrowLink href="/projects" className="detail-back">
          {c("Back to projects")}</ArrowLink>
        <header className="detail-header">
          <Eyebrow>{c("Project /")}{" "}{c(project.status)}</Eyebrow>
          <h1>{c(project.title)}</h1>
          <p>{c(project.description)}</p>
        </header>
        <EditorialImage
          src={project.image}
          alt={c(project.alt)}
          priority
          className="detail-image"
          sizes="100vw"
        />
        <div className="detail-content">
          <div>
            <h2>
              {c(project.slug === "naleta-story"
                ? "About Naleta Story."
                : "About this project.")}
            </h2>
            <div className="prose">
              {project.paragraphs.map((paragraph) => (
                <p key={paragraph}>{c(paragraph)}</p>
              ))}
            </div>
            <MediaEmbed url={project.mediaUrl} locale={locale} />
            <ArticleShare title={project.title} locale={locale}
              url={new URL(`/${locale}/projects/${project.slug}`, siteConfig.url).toString()} />
            {project.id && engagement && <PostEngagement entryId={project.id} locale={locale} {...engagement} />}
            <h2>{c("Project updates.")}</h2>
            <p className="prose">
              {c("I will update this page as the project develops. I will name my role and collaborators.")}</p>
          </div>
          <aside className="detail-sidebar">
            <Eyebrow>{c("Project details")}</Eyebrow>
            <h2>{c(project.status)}</h2>
            <div className="tag-list mb-5">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {c(tag)}
                </span>
              ))}
            </div>
            <p>
              {c("I work on these projects from Goma.")}</p>
            <ArrowLink href="/contact">{c("Discuss this project")}</ArrowLink>
          </aside>
        </div>
        <div className="detail-related">
          <CallToAction
            title={c("A question about this project?")}
            href="/contact"
            label={c("Get in touch")}
          />
        </div>
      </Container>
    </article>
  );
}
