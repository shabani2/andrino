import { getCopy } from "@/i18n/copy-server";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import {
  ArrowLink,
  EditorialImage,
  Eyebrow,
} from "@/components/shared/editorial";
import { CallToAction } from "@/components/shared/call-to-action";
import { getProjects, getProjectBySlug } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return getProjects().map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: Props) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  return createMetadata(project.title, project.description, "/projects/" + project.slug);
}
export default async function ProjectPage({ params }: Props) {
  const c = await getCopy();

  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  return (
    <article className="detail-page">
      <Container>
        <ArrowLink href="/projects" className="detail-back">
          {c("Back to projects")}</ArrowLink>
        <header className="detail-header">
          <Eyebrow>{c("Ideas in progress /")}{" "}{c(project.status)}</Eyebrow>
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
                ? "Making room for richer narratives."
                : "People and experiences behind the work.")}
            </h2>
            <div className="prose">
              {project.paragraphs.map((paragraph) => (
                <p key={paragraph}>{c(paragraph)}</p>
              ))}
            </div>
            <h2>{c("A project as it grows.")}</h2>
            <p className="prose">
              {c("This space will document the initiative’s evolution, my role, collaborators and contribution. Only approved and publicly shareable materials will be featured.")}</p>
          </div>
          <aside className="detail-sidebar">
            <Eyebrow>{c("Project notes")}</Eyebrow>
            <h2>{c(project.status)}</h2>
            <div className="tag-list mb-5">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {c(tag)}
                </span>
              ))}
            </div>
            <p>
              {c("Rooted in Goma and the Great Lakes region, connected to wider conversations.")}</p>
            <ArrowLink href="/contact">{c("Discuss a collaboration")}</ArrowLink>
          </aside>
        </div>
        <div className="detail-related">
          <CallToAction
            title={c("Let’s explore what comes next.")}
            href="/contact"
            label={c("Get in touch")}
          />
        </div>
      </Container>
    </article>
  );
}
