import { useCopy } from "@/i18n/copy";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { CallToAction } from "@/components/shared/call-to-action";
import { PortfolioExplorer } from "@/components/portfolio/portfolio-explorer";
import { getPortfolioItems } from "@/lib/portfolio";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Portfolio",
  "Selected areas of work in strategic communication, digital media, editorial storytelling and project visibility.",
  "/portfolio",
); }
export default function PortfolioPage() {
  const c = useCopy();

  return (
    <>
      <PageHero
        label={c("The work index")}
        number="03"
        title={c("Selected work.")}
        description={c("My portfolio brings together selected examples of my work in strategic communication, digital media, editorial storytelling and project visibility. Each project represents an opportunity to communicate an idea, document an experience or help an audience understand an issue more clearly.")}
      />
      <section className="pb-20">
        <Container>
          <Suspense fallback={<p role="status">{c("Loading the work index…")}</p>}>
            <PortfolioExplorer items={getPortfolioItems()} />
          </Suspense>
          <div className="portfolio-notes">
            <div className="insight-strip">
              <div>
                <strong>{c("Context first")}</strong>
                <span>
                  {c("Every project begins with a purpose, an audience and a story.")}</span>
              </div>
              <div>
                <strong>{c("Clear contribution")}</strong>
                <span>
                  {c("My role, collaborators and selected outputs will be documented.")}</span>
              </div>
              <div>
                <strong>{c("Verified results")}</strong>
                <span>
                  {c("Approved materials and published work will be added as available.")}</span>
              </div>
            </div>
            <p className="page-note mt-6">
              {c("The index currently introduces my areas of practice. Detailed case studies and approved outputs will be added progressively.")}</p>
          </div>
        </Container>
      </section>
      <section className="section-padding portfolio-collaboration">
        <Container>
          <CallToAction
            title={c("Have a project or collaboration in mind?")}
            href="/contact"
            label={c("Initiate conversation")}
          />
        </Container>
      </section>
    </>
  );
}
