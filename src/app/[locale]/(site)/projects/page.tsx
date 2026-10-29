import { useCopy } from "@/i18n/copy";
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
  "Ideas in progress: Naleta Story, community and youth initiatives, and communication for social impact.",
  "/projects",
); }
export default function ProjectsPage() {
  const c = useCopy();

  const projects = getProjects();
  return (
    <>
      <PageHero
        label={c("Initiatives & ideas")}
        number="05"
        title={c("Ideas in progress.")}
        description={c("Some ideas begin as questions. Others start as conversations, observations or a desire to solve a problem. This section documents selected initiatives I have contributed to, developed or supported. It will also provide space to follow the evolution of projects as they grow.")}
      />
      <section className="pb-20">
        <Container>
          <Eyebrow>{c("Flagship platform")}</Eyebrow>
          <FeaturedProject />
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <SectionIntro
            label={c("Portfolio streams")}
            title={c("People, ideas and impact.")}
          >
            {c("Following how people organise, create, communicate and develop solutions in their communities.")}</SectionIntro>
          <div className="project-streams">
            <div>
              <div className="stream-header">
                <Users size={30} strokeWidth={1.3} aria-hidden="true" />
                <div>
                  <Eyebrow>{c("Stream A")}</Eyebrow>
                  <h3>{c("Community & youth initiatives")}</h3>
                </div>
              </div>
              <ProjectCard project={projects[1]} />
              <div className="stream-note">
                <Eyebrow>{c("Collaboration & learning")}</Eyebrow>
                <h3>{c("Local knowledge. Shared possibilities.")}</h3>
                <p>
                  {c("Selected initiatives will highlight my contribution and the lessons learned through collaboration with young people and community organisations.")}</p>
              </div>
            </div>
            <div>
              <div className="stream-header">
                <HeartHandshake
                  size={30}
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
                <div>
                  <Eyebrow>{c("Stream B")}</Eyebrow>
                  <h3>{c("Communication for social impact")}</h3>
                </div>
              </div>
              <ProjectCard project={projects[2]} />
              <div className="stream-note">
                <Eyebrow>{c("Stories behind the work")}</Eyebrow>
                <h3>{c("Making complex projects accessible.")}</h3>
                <p>
                  {c("Stories, digital content and visibility materials can connect programme activities with the people and experiences behind them.")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <div className="governance">
            <ShieldCheck size={30} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <Eyebrow>{c("Editorial governance & ethical framework")}</Eyebrow>
              <blockquote>
                {c("“Each project will clearly identify my role, collaborators and contribution. Only approved and publicly shareable materials will be featured.”")}</blockquote>
            </div>
          </div>
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <CallToAction
            title={c("Have an initiative or collaboration in development?")}
            href="/contact"
            label={c("Propose a collaboration")}
          />
        </Container>
      </section>
    </>
  );
}
