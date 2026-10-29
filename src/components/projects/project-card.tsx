import { useCopy } from "@/i18n/copy";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/types/project";
import {
  EditorialImage,
  ArrowLink,
  Eyebrow,
} from "@/components/shared/editorial";
export function ProjectCard({ project }: { project: Project }) {
  const c = useCopy();

  return (
    <article className="stream-card">
      <Link href={"/projects/" + project.slug} aria-hidden="true" tabIndex={-1}>
        <EditorialImage src={project.image} alt={c(project.alt)} />
      </Link>
      <div className="stream-card-copy">
        <Eyebrow>{c(project.status)}</Eyebrow>
        <h3>
          <Link href={"/projects/" + project.slug}>{c(project.title)}</Link>
        </h3>
        <p>{c(project.description)}</p>
        <div className="tag-list mt-6">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {c(tag)}
            </span>
          ))}
        </div>
        <ArrowLink href={"/projects/" + project.slug} className="mt-5">
          {c("Explore this initiative")}</ArrowLink>
      </div>
    </article>
  );
}
