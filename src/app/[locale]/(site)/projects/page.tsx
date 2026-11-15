import { getCopy } from "@/i18n/copy-server";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Users, HeartHandshake, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionIntro, Eyebrow } from "@/components/shared/editorial";
import { CallToAction } from "@/components/shared/call-to-action";
import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectCard } from "@/components/projects/project-card";
import { getProjects } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Projects",
  "Naleta Story and Andrino’s projects with young people and local groups.",
  "/projects",
); }
export default async function ProjectsPage() {
  const c = await getCopy();

  const projects = await getProjects(await getLocale() as Locale);
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const community = projects.find((project) => project.slug === "community-youth");
  const impact = projects.find((project) => project.slug === "communication-social-impact");
  const additional = projects.filter((project) =>
    project.slug !== featured?.slug && project.slug !== community?.slug && project.slug !== impact?.slug);
  return (
    <>
      <PageHero
        label={c("My projects")}
        number="05"
        title={c("Projects I am working on.")}
        description={c("I develop some projects myself and support others. Each page shows what the project is and where it stands.")}
      />
      <section className="pb-20">
        <Container>
          <Eyebrow>{c("Featured project")}</Eyebrow>
          {featured && <FeaturedProject project={featured} />}
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <SectionIntro
            label={c("Other projects")}
            title={c("Youth, media and communication.")}
          >
            {c("These projects concern young people, local groups and communication.")}</SectionIntro>
          <div className="project-streams">
            <div>
              <div className="stream-header">
                <Users size={30} strokeWidth={1.3} aria-hidden="true" />
                <div>
                  <h3>{c("Projects with young people")}</h3>
                </div>
              </div>
              {community && <ProjectCard project={community} />}
            </div>
            <div>
              <div className="stream-header">
                <HeartHandshake
                  size={30}
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
                <div>
                  <h3>{c("Communication for local projects")}</h3>
                </div>
              </div>
              {impact && <ProjectCard project={impact} />}
            </div>
          </div>
        </Container>
      </section>
      {additional.length > 0 && (
        <section className="pb-20">
          <Container>
            <div className="project-streams">
              {additional.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
          </Container>
        </section>
      )}
      <section className="pb-20">
        <Container>
          <div className="governance">
            <ShieldCheck size={30} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <Eyebrow>{c("How projects are presented")}</Eyebrow>
              <p>
                {c("I will explain my role in each project and name collaborators where I can. I will only share approved material.")}</p>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <CallToAction
            title={c("Working on a project?")}
            href="/contact"
            label={c("Talk about working together")}
          />
        </Container>
      </section>
    </>
  );
}
