import { getCopy } from "@/i18n/copy-server";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { CallToAction } from "@/components/shared/call-to-action";
import { PortfolioExplorer } from "@/components/portfolio/portfolio-explorer";
import { getPortfolioItems } from "@/lib/portfolio";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Portfolio",
  "Andrino’s work in communications, writing, photography and video.",
  "/portfolio",
); }
export default async function PortfolioPage() {
  const c = await getCopy();
  const items = await getPortfolioItems(await getLocale() as Locale);

  return (
    <>
      <PageHero
        label={c("My portfolio")}
        number="03"
        title={c("Projects and areas of work.")}
        description={c("I work with articles, photography, video and communication plans. This page shows the areas I work in and how I approach them.")}
      />
      <section className="pb-20">
        <Container>
          <Suspense fallback={<p role="status">{c("Loading portfolio…")}</p>}>
            <PortfolioExplorer items={items} />
          </Suspense>
          <div className="portfolio-notes">
            <div className="insight-strip">
              <div>
                <strong>{c("Start with the context")}</strong>
                <span>
                  {c("I ask who the work is for and what it should explain.")}</span>
              </div>
              <div>
                <strong>{c("My role")}</strong>
                <span>
                  {c("Each case study will name my role and the people involved.")}</span>
              </div>
              <div>
                <strong>{c("Published work")}</strong>
                <span>
                  {c("I will add work I can share and verify.")}</span>
              </div>
            </div>
            <p className="page-note mt-6">
              {c("For now, this page introduces my areas of work. I will add detailed examples when they are ready to share.")}</p>
          </div>
        </Container>
      </section>
      <section className="section-padding portfolio-collaboration">
        <Container>
          <CallToAction
            title={c("A project to discuss?")}
            href="/contact"
            label={c("Discuss your project")}
          />
        </Container>
      </section>
    </>
  );
}
