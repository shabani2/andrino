import { useCopy } from "@/i18n/copy";
import type { Project } from "@/types/project";
import {
  ArrowLink,
  EditorialImage,
  Eyebrow,
} from "@/components/shared/editorial";
export function FeaturedProject({ project }: { project: Project }) {
  const c = useCopy();
  return (
    <article className="featured-project">
      <EditorialImage src={project.image} alt={c(project.alt)} priority />
      <div className="featured-project-copy">
        <Eyebrow>{c(project.slug === "naleta-story" ? "Featured initiative · Media direction" : "Featured initiative")}</Eyebrow>
        <h2>{c(project.title)}</h2>
        <div className="prose">
          <p>{c(project.description)}</p>
          {project.paragraphs.map((paragraph) => (
            <p key={paragraph}>{c(paragraph)}</p>
          ))}
        </div>
        <dl className="project-specs">
          <div>
            <dt>{c("Focus")}</dt>
            <dd>{project.tags.map((tag) => c(tag)).join(" · ")}</dd>
          </div>
          <div>
            <dt>{c("Status")}</dt>
            <dd>{c(project.status)}</dd>
          </div>
        </dl>
        <ArrowLink href={"/projects/" + project.slug}>
          {c("View project details")}</ArrowLink>
      </div>
    </article>
  );
}
