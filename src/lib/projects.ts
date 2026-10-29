import { projectDirections } from "@/content/editorial";
import type { Project } from "@/types/project";
export function getProjects(): Project[] {
  return projectDirections.map((item) => ({
    ...item,
    body: item.paragraphs.join("\n\n"),
    images: [item.image],
  }));
}
export function getProjectBySlug(slug: string) {
  return getProjects().find((item) => item.slug === slug);
}
