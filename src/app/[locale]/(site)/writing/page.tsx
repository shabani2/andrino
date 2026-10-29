import { useCopy } from "@/i18n/copy";
import { Suspense } from "react";
import { Rss, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { ArrowLink, Eyebrow } from "@/components/shared/editorial";
import { FeaturedArticle } from "@/components/writing/featured-article";
import { WritingExplorer } from "@/components/writing/writing-explorer";
import { identity } from "@/config/identity";
import { getArticles } from "@/lib/articles";
import { createMetadata } from "@/lib/seo";
export async function generateMetadata() { return createMetadata(
  "Writing",
  "Ideas, observations and opinions on African narratives, Goma, media, innovation, society and the writing life.",
  "/writing",
); }
export default function WritingPage() {
  const c = useCopy();

  return (
    <>
      <PageHero
        label={c("The journal · Folio")}
        title={c("Ideas, observations and opinions.")}
        description={c("Writing is one of the main reasons I am building this website. I want Andrino to be a space where I can publish stories, explore questions, share opinions and document observations that deserve more attention.")}
      />
      <section className="pb-20">
        <Container>
          <div className="writing-intro-note mb-8">
            <span>{c("Dispatches from Goma & the Great Lakes")}</span>
            <span>{c("6 editorial themes · First publications forthcoming")}</span>
          </div>
          <FeaturedArticle />
          <Suspense fallback={<p role="status">{c("Loading the journal…")}</p>}>
            <WritingExplorer articles={getArticles()} />
          </Suspense>
          <div className="editorial-bottom-grid">
            <section className="editorial-standards">
              <Eyebrow>
                <ShieldCheck
                  size={15}
                  className="inline mr-2"
                  aria-hidden="true"
                />
                {c("Editorial standard & ethics")}</Eyebrow>
              <h2>{c("A note on opinions.")}</h2>
              <blockquote>
                {c("“The opinions expressed in my personal writing are my own.”")}</blockquote>
              <p>
                {c("I aim to distinguish personal perspectives from verified facts, give context to the issues I discuss and remain open to new information and different points of view.")}</p>
              <ArrowLink href="/about">{c("Read my guiding principles")}</ArrowLink>
            </section>
            <section className="dispatch-panel">
              <Eyebrow>
                <Rss size={15} className="inline mr-2" aria-hidden="true" />
                {c("The dispatch")}</Eyebrow>
              <h2>
                {c("A space for ideas.")}<br />{c("A conversation that continues.")}</h2>
              <p>
                {c("Some articles will be based on reporting and conversations with people. Others will be personal essays or commentary on issues that interest me.")}</p>
              <ArrowLink href={identity.substack} external>
                {c("Find me on Substack")}</ArrowLink>
              <ArrowLink href="/links">{c("Across the web")}</ArrowLink>
            </section>
          </div>
        </Container>
      </section>
    </>
  );
}
